import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { BaseService } from '../services/application/base.service';
import {
  ConsultaDebitoRequest,
  ConsultaDebitoResponse,
  ConsultaPedidoResponse,
  ConsultaPlacaResponse,
} from '../models/application';
import { ConsultaPedidoRequest } from '../models/application/consultaPedido/ConsultaPedidoRequest';
import { ConsultaPlacaRequest } from '../models/application/consultaPlaca/ConsultaPlacaRequest';
import {
  ProcessaPagamentoRequest,
  ProcessaPagamentoResponse,
} from '../models/application';
import { VeiculoAppService } from '../modules/application/veiculo/service/veiculo-app.service';

@ApiSecurity('x-api-key')
@ApiTags('Veicular')
@Controller('veiculo')
export class AppController {
  constructor(
    private readonly baseService: BaseService,
    private readonly veiculoService: VeiculoAppService
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
      return await this.baseService.consultarPedido(
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
      return await this.baseService.consultaDebitos(data);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Consulta débitos associados a um veículo.
   * @param data Dados para consulta de débitos (placa, email, telefone).
   */
  @ApiOperation({ summary: 'Consultar os débitos de um veículo pela placa' })
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
      return await this.baseService.processaPagamento(data);
    } catch (error) {
      throw error;
    }
  }
}
