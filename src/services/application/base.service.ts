import { Injectable, HttpException } from '@nestjs/common';
import { ApiService } from '../api/api.service';
import { VeiculoService } from '../domain/veiculo.service';
import { ConsultaPlacaResponse } from '../../models/application/ConsultaPlaca/ConsultaPlacaResponse';
import Veiculo from '../../models/domain/veiculo.model';
import { PNHConsultaDebitosRequest } from '../../models/api/consultaDebito/PNHConsultaDebitosRequest';
import { PedidoService } from '../domain/pedido.service';
import { ConsultaDebitoRequest } from '../../models/application/consultaDebito/ConsultaDebitoRequest';
import { ConsultaDebitoResponse } from '../../models/application/consultaDebito/ConsultaDebitoResponse';
import { DebitoService } from '../domain/debito.service';
import { ConsultaPedidoResponse } from '../../models/application/ConsultaPedido/ConsultaPedidoResponse';
import * as moment from "moment";

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
   */
  async consultarPedido(numeroPedido: number): Promise<ConsultaPedidoResponse> {
    if (!numeroPedido || numeroPedido <= 0)
      throw new HttpException('Número do pedido inválido', 400);

    const apiResponse = await this.apiService.consultarStatusPedido(numeroPedido);

    const pedidoDb = await this.pedidoService.buscarPorNumeroPedido(numeroPedido);

    if (pedidoDb && pedidoDb.status !== this.statusInicial) {
      const updatedData = { status: apiResponse.data.status };
      await this.pedidoService.update(pedidoDb.id, updatedData);
    }

    return apiResponse as ConsultaPedidoResponse;
  }

  /**
   * Consulta informações de um veículo pela placa.
   * Verifica na base local e, caso não encontre, consulta na API externa.
   * @param placa Placa do veículo.
   * @return ConsultaPlacaResponse resposta
   */
  async consultarPlaca(placa: string): Promise<ConsultaPlacaResponse> {
    if (!placa || !placa.trim()) throw new HttpException('Placa inválida', 400);

    placa = placa.toLowerCase();

    const veiculo = await this.veiculoService.buscarPorPlaca(placa);

    if (veiculo) {
      console.log('Veiculo vindo do banco');
      return this.mapVeiculoToResponse(veiculo);
    }

    const apiResponse = await this.apiService.consultarPlaca(placa);
    if (!apiResponse.resposta || !apiResponse.resposta.renavam)
      throw new HttpException('Erro na consulta de placa', 404);

    console.log(apiResponse.resposta);
    const dbResult: Veiculo = await this.veiculoService.inserir({
      ...apiResponse.resposta,
      anoFabricacao: apiResponse.resposta.ano_fabricacao,
    });

    return this.mapVeiculoToResponse(dbResult);
  }

  /**
   * Consulta débitos associados a um veículo pela placa.
   * @param data Dados para consulta de débitos.
   */
  async consultaDebitos(
    data: ConsultaDebitoRequest,
  ): Promise<ConsultaDebitoResponse> {
    const veiculoDb = await this.consultarPlaca(data.placa);

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
          vencimento: moment(element.vencimento).format('DD/MM/YYYY'),
          status_debito: element.statusDebito,
          cod_fatura: element.codFatura,
          descricao: element.descricao,
          valor: element.valor.toString(),
        });
      });
      return response;
    }

    const request = new PNHConsultaDebitosRequest();
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

    let debitos = [];
    if (apiResult.data.debitos?.length > 0) {
      apiResult.data.debitos.map((item) => {
        const vencimento = moment(item.vencimento, 'M/D/YYYY h:mm:ss A').format(
          'YYYY-MM-DD HH:mm:ss',
        );
        debitos.push({
          ...item,
          vencimento,
          pedidoId: newPedidoDb.id,
        });
      });
      debitos = await this.debitoService.createAll(debitos);
    }

    response.pedido = apiResult.data.pedido;
    response.mensagem = apiResult.data.mensagem;
    response.debitos = debitos;

    return response;
  }

  /**
   * Verifica se uma consulta é antiga com base na data.
   * @param data Data da consulta.
   */
  private isConsultaAntiga(data: Date): boolean {
    const hoje = new Date().setHours(0, 0, 0, 0);
    const dataComparada = new Date(data).setHours(0, 0, 0, 0);
    return dataComparada !== hoje;
  }

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
