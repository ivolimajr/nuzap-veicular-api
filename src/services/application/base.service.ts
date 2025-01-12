import { HttpException, Injectable } from '@nestjs/common';
import * as moment from 'moment';

import { getDigits } from '../../utils/stringUtils';
import Veiculo from '../../models/domain/veiculo.model';
import { ApiService } from '../api/api.service';

import { DebitoService, PedidoService, VeiculoService } from '../domain';
import {
  ConsultaDebitoRequest,
  ConsultaDebitoResponse,
  ConsultaPedidoResponse,
  ConsultaPlacaResponse,
  ProcessaPagamentoRequest,
  ProcessaPagamentoResponse,
} from '../../models/application';
import {
  PNHConsultaDebitoRequest,
  PNHProcessaPagamentoRequest,
} from '../../models/api';
import { Debito } from '../../models/domain/debito.model';

@Injectable()
export class BaseService {
  private statusInicial: string = 'Consulta';

  constructor(
    private readonly apiService: ApiService,
    private readonly veiculoService: VeiculoService,
    private readonly pedidoService: PedidoService,
    private readonly debitoService: DebitoService,
  ) {}

  /**
   * Consulta o status de um pedido pelo número do pedido.
   * @param numeroPedido Número do pedido.
   * @return Promise<ConsultaPedidoResponse>
   */
  async consultarPedido(numeroPedido: number): Promise<ConsultaPedidoResponse> {
    if (!numeroPedido || numeroPedido <= 0)
      throw new HttpException('Número do pedido inválido', 400);

    try {
      const apiResponse =
        await this.apiService.consultarStatusPedido(numeroPedido);

      const pedidoDb =
        await this.pedidoService.buscarPorNumeroPedido(numeroPedido);

      if (pedidoDb && pedidoDb.status !== apiResponse.data?.status) {
        console.info(
          `current status: ${pedidoDb.status} | new status: ${apiResponse.data.status}`,
        );
        const updatedData = { status: apiResponse.data.status };
        await this.pedidoService.update(pedidoDb.id, updatedData);
      }

      return apiResponse as ConsultaPedidoResponse;
    } catch (e) {
      throw e;
    }
  }

  /**
   * Consulta informações de um veículo pela placa.
   * Verifica na base local e, caso não encontre, consulta na API externa.
   * @param placa Placa do veículo.console.info(
   *           `current status: ${pedidoDb.status} | new status: ${apiResponse.data.status}`,
   *         );
   * @return Promise<ConsultaPlacaResponse>
   */
  async consultarPlaca(placa: string): Promise<ConsultaPlacaResponse> {
    if (!placa || !placa.trim()) throw new HttpException('Placa inválida', 400);

    placa = placa.toLowerCase();

    try {
      const veiculo = await this.veiculoService.buscarPorPlaca(placa);

      if (veiculo) {
        console.log('Veiculo vindo do banco');
        return this.mapVeiculoToResponse(veiculo);
      }

      const apiResponse = await this.apiService.consultarPlaca(placa);
      if (!apiResponse.resposta || !apiResponse.resposta.renavam)
        throw new HttpException('Erro na consulta de placa', 404);

      const dbResult = await this.veiculoService.inserir({
        ...apiResponse.resposta,
        anoFabricacao: apiResponse.resposta.ano_fabricacao,
      });

      return this.mapVeiculoToResponse(dbResult);
    } catch (e) {
      throw e;
    }
  }

  /**
   * Consulta débitos associados a um veículo pela placa.
   * @param data Dados para consulta de débitos.
   * @return Promise<ConsultaDebitoResponse>
   */
  async consultaDebitos(
    data: ConsultaDebitoRequest,
  ): Promise<ConsultaDebitoResponse> {
    data.telefone = getDigits(data.telefone);

    const veiculoDb = await this.consultarPlaca(data.placa);

    try {
      const pedidoDb = await this.pedidoService.buscarPorVeiculo(veiculoDb.id);

      let response: ConsultaDebitoResponse = new ConsultaDebitoResponse();

      //se vier uma resposta do banco de dados e for válida, retorna os débitos da base
      if (
        pedidoDb &&
        !this.isConsultaAntiga(pedidoDb.createdAt) &&
        pedidoDb.debitos.length > 0
      ) {
        console.log('Debitos vindo do banco');
        response = {
          pedido: pedidoDb.pedido,
          status: pedidoDb.status,
          mensagem: pedidoDb.mensagem,
          debitos: [],
        };
        pedidoDb.debitos.forEach((element) => {
          response.debitos.push({
            vencimento: element.vencimento,
            vencimento_formatado: moment(element.vencimento).format(
              'DD/MM/YYYY',
            ),
            status_debito: element.statusDebito,
            cod_fatura: element.codFatura,
            descricao: element.descricao,
            valor: element.valor.toString(),
          });
        });
        return response;
      }

      const request = new PNHConsultaDebitoRequest();
      request.placa = data.placa.toLowerCase();
      request.cpf = veiculoDb.cpfCnpj;
      request.uf = veiculoDb.uf;
      request.email = data.email;
      request.telefone = data.telefone;
      request.renavam = veiculoDb.renavam;
      request.chassi = veiculoDb.chassi;

      const apiResult = await this.apiService.consultaDebitos(request);

      if (!apiResult.success)
        throw new HttpException(
          apiResult.message || 'Erro na consulta de débitos',
          400,
        );

      const newPedidoDb = await this.pedidoService.create({
        veiculoId: veiculoDb.id,
        mensagem: apiResult.message,
        status: this.statusInicial,
        pedido: apiResult.data.pedido,
      });

      let debitos: any[] = [];
      let debitosCriados: Debito[] = [];
      if (apiResult.data.debitos?.length > 0) {
        apiResult.data.debitos.map((item) => {
          const vencimento = moment(
            item.vencimento,
            'M/D/YYYY h:mm:ss A',
          ).toDate();
          debitos.push({
            ...item,
            vencimento,
            pedidoId: newPedidoDb.id,
          });
        });
        debitosCriados = await this.debitoService.createAll(debitos);
      }

      response.pedido = apiResult.data.pedido;
      response.mensagem = apiResult.message || apiResult.data.mensagem;
      response.debitos = debitosCriados.map((item:Debito) => {
        return {
          vencimento: item.vencimento,
          status_debito: item.statusDebito,
          vencimento_formatado: moment(item.vencimento).format('DD/MM/YYYY'),
          cod_fatura: item.codFatura,
          descricao: item.descricao,
          valor: item.valor.toString(),
        };
      });

      return response;
    } catch (e) {
      throw e;
    }
  }

  /**
   * Processa o pagamento dos pedidos.
   * @param data Dados para consulta de débitos.
   * @type ProcessaPagamentoRequest
   * @return Promise<PNHProcessaPagamentoRequest>
   */
  async processaPagamento(
    data: ProcessaPagamentoRequest,
  ): Promise<ProcessaPagamentoResponse> {
    const request = new PNHProcessaPagamentoRequest();

    request.cdFaturas = data.cdFaturas;
    request.parcelas = data.parcelas.toString();
    request.valorPagCartao = data.valorPagCartao.toFixed(1).replace('.', ',');
    request.valorWynk = data.valorPagCartao.toFixed(1).replace('.', ',');
    request.email = data.email;
    request.celular = getDigits(data.telefone);
    request.securityCode = data.securityCode.toString();
    request.creditCardNumber = data.creditCardNumber;
    request.monthYear = data.monthYear;
    request.holderName = data.holderName;
    request.cpfcnpj = getDigits(data.cpfcnpj);
    request.telefone = getDigits(data.telefone);

    try {
      // Chama o serviço externo com o mapeamento realizado
      const apiResult = await this.apiService.processaPagamento(request);

      const consultaResponse = await this.consultarPedido(
        apiResult.data.pedido,
      );
      apiResult.data.mensagem = consultaResponse.data.status;

      return apiResult;
    } catch (error) {
      throw error;
    }
  }

  //PRIVATES METHODS

  /**
   * Verifica se uma consulta é antiga com base na data.
   * @param data Data da consulta.
   */
  private isConsultaAntiga(data: Date): boolean {
    const hoje = new Date().setHours(0, 0, 0, 0);
    const dataComparada = new Date(data).setHours(0, 0, 0, 0);
    return dataComparada !== hoje;
  }

  /**
   * Mapeia um obj do tipo veiculo para o tipo de resposta do serviço
   * @param veiculo
   * @type Veiculo
   * @return ConsultaPlacaResponse
   */
  private mapVeiculoToResponse(veiculo: Veiculo): ConsultaPlacaResponse {
    return {
      id: veiculo.id,
      placa: veiculo.placa,
      chassi: veiculo.chassi,
      renavam: veiculo.renavam,
      marcaModelo: veiculo.marcaModelo,
      ano_fabricacao: veiculo.anoFabricacao,
      cor: veiculo.cor,
      anoModelo: veiculo.anoModelo,
      uf: veiculo.uf,
      cpfCnpj: veiculo.cpfCnpj,
    };
  }
}
