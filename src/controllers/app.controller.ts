import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { ConsultaPedidoRequest, ConsultaPedidoResponse } from '../modules/application/pedido/models';
import { VeiculoAppService } from '../modules/application/veiculo/service/veiculo-app.service';
import { DebitoAppService } from '../modules/application/debito/service/debito-app.service';
import { PedidoAppService } from '../modules/application/pedido/service/pedido-app.service';
import { PagamentoAppService } from '../modules/application/pagamento/service/pagamento-app.service';
import { ConsultaPlacaRequest, ConsultaPlacaResponse } from '../modules/application/veiculo/models';
import { ConsultaDebitoRequest, ConsultaDebitoResponse } from '../modules/application/debito/models';
import { ProcessaPagamentoRequest, ProcessaPagamentoResponse } from '../modules/application/pagamento/models';

@ApiSecurity('x-api-key')
@ApiTags('Veicular')
@Controller('veiculo')
export class AppController {
  constructor(
    private readonly veiculoService: VeiculoAppService,
    private readonly pedidoService: PedidoAppService,
    private readonly debitoService: DebitoAppService,
    private readonly pagamentoService: PagamentoAppService
  ) {}

  /**
   * Consulta o status de um pedido pelo número.
   * @param params
   * @type ConsultaPedidoRequest
   */
  @ApiOperation({ summary: 'Consultar o status de um pedido' })
  @ApiParam({
    name: 'numeroPedido',
    description: 'Numero do pedido',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Informações do pedido',
    type: ConsultaPedidoResponse,
  })
  @Get('consultar-pedido/:numeroPedido')
  @HttpCode(200)
  async consultarPedido(
    @Param() params: ConsultaPedidoRequest,
  ): Promise<ConsultaPedidoResponse> {
    try {
      return await this.pedidoService.consultarPedido(
        Number(params.numeroPedido),
      );
    } catch (error) {
      throw error;
    }
  }

  /**
   * Consulta as informações de um veículo pela placa.
   * @param params
   * @type ConsultaPlacaRequest
   */
  @ApiOperation({ summary: 'Consultar veículo pela placa' })
  @ApiParam({ name: 'placa', description: 'Placa do veículo', type: String })
  @ApiParam({
    name: 'renavam',
    description: 'Renavam do veículo',
    type: String,
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Informações do veículo retornadas com sucesso',
    type: ConsultaPlacaResponse,
  })
  @Get('consultar-placa/:placa/:renavam?')
  @HttpCode(200)
  async consultarPlaca(
    @Param() params: ConsultaPlacaRequest,
  ): Promise<ConsultaPlacaResponse> {
    try {
      return await this.veiculoService.consultarPlaca(
        params.placa,
        params.renavam || null,
      );
    } catch (error) {
      throw error;
    }
  }

  /**
   * Consulta débitos associados a um veículo.
   * @param data Dados para consulta de débitos (placa, email, telefone).
   */
  @ApiOperation({ summary: 'Consultar os débitos de um veículo pela placa' })
  @ApiBody({ type: ConsultaDebitoRequest })
  @ApiResponse({
    status: 200,
    description: 'Informações do veículo retornadas com sucesso',
    type: ConsultaDebitoResponse,
  })
  @Post('consultar-debitos')
  @HttpCode(200)
  async consultarDebitos(
    @Body() data: ConsultaDebitoRequest,
  ): Promise<ConsultaDebitoResponse> {
    try {
      return await this.debitoService.consultaDebitos(data);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Consulta débitos associados a um veículo.
   * @param data Dados para consulta de débitos (placa, email, telefone).
   */
  @ApiOperation({ summary: 'Processa um pagamento de uma lista de débitos' })
  @ApiBody({ type: ProcessaPagamentoRequest })
  @ApiResponse({
    status: 200,
    description: 'Informações do veículo retornadas com sucesso',
    type: ProcessaPagamentoResponse,
  })
  @Post('processa-pagamento')
  @HttpCode(200)
  async processaPagamento(
    @Body() data: ProcessaPagamentoRequest,
  ): Promise<ProcessaPagamentoResponse> {
    try {
      return await this.pagamentoService.processaPagamento(data);
    } catch (error) {
      throw error;
    }
  }
}
