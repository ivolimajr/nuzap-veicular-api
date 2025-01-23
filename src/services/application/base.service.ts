import { Injectable } from '@nestjs/common';
import * as moment from 'moment';

import { exists, getDigits } from '../../utils/stringUtils';
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
import { CustomException } from '../../middleares/CustomException';

@Injectable()
export class BaseService {
  private readonly statusInicial: string = 'Consulta';
  private readonly requisitosPorUF: Record<string, string[]> = {
    DF: ['renavam'],
    MG: ['renavam'],
    GO: ['renavam'],
    AC: ['renavam', 'cpfCnpj'],
    AL: ['renavam'],
    AM: ['renavam'],
    AP: ['renavam'],
    BA: ['renavam'],
    ES: ['renavam'],
    MS: ['renavam'],
    MA: ['renavam', 'cpfCnpj'],
    MT: ['renavam', 'Chassi'],
    PB: ['renavam'],
    PE: ['renavam', 'cpfCnpj'],
    PI: ['renavam', 'cpfCnpj'],
    RN: ['renavam'],
    RR: ['renavam'],
    TO: ['renavam', 'cpfCnpj'],
    RO: ['renavam'],
    RS: ['renavam', 'cpfCnpj'],
    SC: ['renavam', 'cpfCnpj'],
    CE: ['renavam', 'cpfCnpj'],
    SP: ['renavam'],
    RJ: ['renavam', 'cpfCnpj'],
    PR: ['renavam', 'cpfCnpj'],
    PA: ['renavam', 'cpfCnpj'],
  };

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
      throw new CustomException(
        'Número do pedido inválido',
        400,
        'Informe o número do pedido corretamente',
        numeroPedido,
      );

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
   * @param renavam Opcional
   * @param chassi Opcional
   * @param documento Opcional
   * @return Promise<ConsultaPlacaResponse>
   */
  async consultarPlaca(
    placa: string,
    renavam: string = null,
    chassi: string = null,
    documento: string = null,
  ): Promise<ConsultaPlacaResponse> {
    if (!placa || !placa.trim())
      throw new CustomException(
        'Placa inválida',
        400,
        'Verifique a placa informada',
        placa,
      );

    placa = placa.replace(/[^A-Za-z0-9]/g, '').toLowerCase();
    renavam = renavam ? renavam.trim() : null;
    chassi = chassi ? chassi.trim() : null;
    documento = documento ? getDigits(documento) : null;

    try {
      const veiculo = await this.veiculoService.buscarPorPlaca(placa);

      if (veiculo) {
        console.log('Veiculo vindo do banco');
        return this.mapVeiculoToResponse(veiculo);
      }

      const apiResponse = await this.apiService.consultarPlaca(placa);

      if (
        !apiResponse.resposta ||
        exists(apiResponse.solicitacao?.mensagem, 'Erro')
      ) {
        if (apiResponse.solicitacao?.mensagem)
          throw new CustomException(
            apiResponse.solicitacao.mensagem,
            404,
            'Veículo não encontrado',
            apiResponse,
          );
        throw new CustomException(
          'Falha ao consultar placa',
          404,
          'Tente realizar a consulta em outro momento.',
        );
      }

      //Caso não venha nenhum dado da API, retorna que o veiculo não foi encontrado
      if (
        !apiResponse.resposta.chassi &&
        !apiResponse.resposta.uf &&
        !apiResponse.resposta.marcaModelo &&
        !apiResponse.resposta.cpfCnpj
      )
        throw new CustomException(
          'Informações do veículos insuficientes',
          404,
          'Não tivemos informações suficientes sobre o veiculo',
          apiResponse,
        );

      const _veiculo = {
        ...apiResponse.resposta,
        renavam: apiResponse.resposta.renavam || renavam,
        chassi: apiResponse.resposta.chassi || chassi,
        cpfCnpj: apiResponse.resposta.cpfCnpj || documento,
        anoFabricacao: apiResponse.resposta.ano_fabricacao,
      };

      const dbResult = await this.veiculoService.inserir(_veiculo);

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
    data.placa = data.placa
      .trim()
      .replace(/[^A-Za-z0-9]/g, '')
      .toLowerCase();
    data.renavam = data.renavam ? data.renavam.trim() : null;
    data.chassi = data.chassi ? data.chassi.trim() : null;
    data.cpfCnpj = data.cpfCnpj ? getDigits(data.cpfCnpj) : null;

    const veiculo = await this.consultarPlaca(
      data.placa,
      data.renavam,
      data.chassi,
      data.cpfCnpj,
    );

    // Valida os requisitos para a UF do veículo
    this.validarRequisitosPorUF(veiculo.uf, veiculo, data);

    try {
      const pedidoDb = await this.pedidoService.buscarPorVeiculo(veiculo.id);

      let response: ConsultaDebitoResponse = new ConsultaDebitoResponse();

      //se vier uma resposta do banco de dados e for válida, retorna os débitos da base
      if (
        pedidoDb &&
        pedidoDb.status.toLowerCase() === this.statusInicial.toLowerCase() &&
        !this.isConsultaAntiga(pedidoDb.createdAt) &&
        pedidoDb.debitos.length > 0
      ) {
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
      request.placa = data.placa.toLowerCase() || request.placa;
      request.cpf = veiculo.cpfCnpj || data.cpfCnpj;
      request.uf = veiculo.uf;
      request.email = data.email;
      request.telefone = data.telefone;
      request.renavam = veiculo.renavam || data.renavam;
      request.chassi = veiculo.chassi || data.chassi;

      const apiResult = await this.apiService.consultaDebitos(request);

      if (!apiResult.success)
        throw new CustomException(
          apiResult.message,
          400,
          'Favor, tente novamente mais tarde',
          apiResult,
        );

      const newPedidoDb = await this.pedidoService.create({
        veiculoId: veiculo.id,
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
      response.status = this.statusInicial;
      response.mensagem = apiResult.message || apiResult.data.mensagem;
      response.debitos = debitosCriados.map((item: Debito) => {
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

  private validarRequisitosPorUF(uf: string, veiculo: ConsultaPlacaResponse, data: any): void {
    const requisitos = this.requisitosPorUF[uf];

    if (!requisitos) {
      throw new CustomException(
        `UF não suportada: ${uf}`,
        400,
        'Validação de UF falhou',
      );
    }

    // Verifica cada requisito
    requisitos.forEach((campo) => {
      const valorVeiculo = veiculo[campo];

      if (!valorVeiculo) {
        throw new CustomException(
          `Informe o ${campo} para esta UF (${uf})`,
          400,
          `O campo ${campo} é necessário para realizar a consulta`,
          data,
        );
      }
    });
  }
}
