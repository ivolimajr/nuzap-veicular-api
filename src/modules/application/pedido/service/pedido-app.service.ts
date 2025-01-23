import { Injectable } from '@nestjs/common';
import { PnhApiService } from '../../../integration/pnh-api.service';
import { CustomException } from '../../../../middleares/CustomException';
import { PedidoService } from '../../../domain/pedido/service/pedido.service';
import { ConsultaPedidoResponse } from '../models';

@Injectable()
export class PedidoAppService {
  constructor(
    private readonly apiService: PnhApiService,
    private readonly pedidoService: PedidoService,
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
}
