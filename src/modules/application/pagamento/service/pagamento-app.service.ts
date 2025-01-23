import { Injectable } from '@nestjs/common';
import { PnhApiService } from '../../../integration/pnh-api.service';
import { PNHProcessaPagamentoRequest } from '../../../integration/models';
import { getDigits } from '../../../../utils/stringUtils';
import { PedidoAppService } from '../../pedido/service/pedido-app.service';
import { ProcessaPagamentoRequest, ProcessaPagamentoResponse } from '../models';

@Injectable()
export class PagamentoAppService {
  constructor(
    private readonly apiService: PnhApiService,
    private readonly pedidoAppService: PedidoAppService,
  ) {}

  /**
   * Processa o pagamento dos pedidos.
   * @param data Dados para consulta de débitos.
   * @type ProcessaPagamentoRequest
   * @return Promise<PNHProcessaPagamentoRequest>
   */
  async processaPagamento(
    data: ProcessaPagamentoRequest,
  ): Promise<ProcessaPagamentoResponse> {
    try {
      // Chama o serviço externo com o mapeamento realizado

      const request = this.getRequest(data);

      const apiResult = await this.apiService.processaPagamento(request);

      const consultaResponse = await this.pedidoAppService.consultarPedido(
        apiResult.data.pedido,
      );
      apiResult.data.mensagem = consultaResponse.data.status;

      return apiResult;
    } catch (error) {
      throw error;
    }
  }

  private getRequest(
    data: ProcessaPagamentoRequest,
  ): PNHProcessaPagamentoRequest {
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
    return request;
  }
}
