import { Injectable } from '@nestjs/common';
import { PnhApiService } from '../../../integration/pnh-api.service';
import { getDigits, limparDocumento } from '../../../../utils/stringUtils';
import * as moment from 'moment/moment';
import {
  PNHConsultaDebitoRequest,
  PNHConsultaDebitoResponse,
} from '../../../integration/models';
import { CustomException } from '../../../../middleares/CustomException';
import { Debito } from '../../../domain/debito/models/debito.model';
import { VeiculoAppService } from '../../veiculo/service/veiculo-app.service';
import { PedidoService } from '../../../domain/pedido/service/pedido.service';
import { DebitoService } from '../../../domain/debito/service/debito.service';
import { ConsultaDebitoRequest, ConsultaDebitoResponse } from '../models';
import { RequisitosPorUF } from '../../../../utils/const';
import { ConsultaPlacaResponse } from '../../veiculo/models';

@Injectable()
export class DebitoAppService {
  private readonly statusInicial: string = 'Consulta';
  private readonly requisitosPorUF: Record<string, string[]> = RequisitosPorUF;

  constructor(
    private readonly apiService: PnhApiService,
    private readonly veiculoAppService: VeiculoAppService,
    private readonly pedidoService: PedidoService,
    private readonly debitoService: DebitoService,
  ) {}

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
    data.cpfCnpj = data.cpfCnpj ? limparDocumento(data.cpfCnpj) : null;

    const veiculo = await this.veiculoAppService.consultarPlaca(
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
        console.info('Debitos vindo do banco');
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

      //processa requisição via API
      return await this.processaConsulta(data, veiculo);
    } catch (e) {
      throw e;
    }
  }

  private async processaConsulta(
    data: ConsultaDebitoRequest,
    veiculo: ConsultaPlacaResponse,
  ): Promise<ConsultaDebitoResponse> {
    const request = this.getRequest(data, veiculo);

    const apiResult = await this.apiService.consultaDebitos(request);

    //salva o pedido no banco
    const newPedidoDb = await this.pedidoService.create({
      veiculoId: veiculo.id,
      mensagem: apiResult.message,
      status: this.statusInicial,
      pedido: apiResult.data.pedido,
    });

    //salva os debitos no banco
    let debitosCriados = await this.salvaDebitosBanco(
      apiResult,
      newPedidoDb.id,
    );

    return this.getResponse(apiResult, debitosCriados);
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

  private async salvaDebitosBanco(
    apiResult: PNHConsultaDebitoResponse,
    pedidoId: number,
  ): Promise<Debito[]> {
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
          pedidoId: pedidoId,
        });
      });
      debitosCriados = await this.debitoService.createAll(debitos);
    }
    return debitosCriados;
  }

  private getRequest(
    data: ConsultaDebitoRequest,
    veiculo: ConsultaPlacaResponse,
  ): PNHConsultaDebitoRequest {
    const request = new PNHConsultaDebitoRequest();
    request.placa = data.placa.toLowerCase() || request.placa;
    request.cpf = veiculo.cpfCnpj || data.cpfCnpj;
    request.uf = veiculo.uf;
    request.email = data.email;
    request.telefone = data.telefone;
    request.renavam = veiculo.renavam || data.renavam;
    request.chassi = veiculo.chassi || data.chassi;
    return request;
  }

  getResponse(
    apiResult: PNHConsultaDebitoResponse,
    debitosCriados: Debito[],
  ): ConsultaDebitoResponse {
    let response: ConsultaDebitoResponse = new ConsultaDebitoResponse();
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
