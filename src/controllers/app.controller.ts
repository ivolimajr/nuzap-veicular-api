import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { BaseService } from '../services/application/base.service';
import { ConsultaPlacaResponse } from '../models/application/ConsultaPlaca/ConsultaPlacaResponse';
import { PNHConsultaDebitosRequest } from '../models/api/consultaDebito/PNHConsultaDebitosRequest';
import { ConsultaDebitoRequest } from '../models/application/consultaDebito/ConsultaDebitoRequest';
import { ConsultaDebitoResponse } from '../models/application/consultaDebito/ConsultaDebitoResponse';
import { ConsultaPedidoResponse } from '../models/application/ConsultaPedido/ConsultaPedidoResponse';

@ApiSecurity('x-api-key')
@ApiTags('Veicular')
@Controller('veiculo')
export class AppController {
  constructor(private readonly baseService: BaseService) {}

  /**
   * Consulta o status de um pedido pelo número.
   * @param numeroPedido Número do pedido a ser consultado.
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
  async consultarPedido(
    @Param('numeroPedido') numeroPedido: string,
  ): Promise<ConsultaPedidoResponse> {
    try {
      return await this.baseService.consultarPedido(Number(numeroPedido));
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Consulta as informações de um veículo pela placa.
   * @param placa Placa do veículo.
   */
  @ApiOperation({ summary: 'Consultar veículo pela placa' })
  @ApiParam({ name: 'placa', description: 'Placa do veículo', type: String })
  @ApiResponse({
    status: 200,
    description: 'Informações do veículo retornadas com sucesso',
    type: ConsultaPlacaResponse,
  })
  @Get('consultar-placa/:placa')
  async consultarPlaca(
    @Param('placa') placa: string,
  ): Promise<ConsultaPlacaResponse> {
    try {
      return await this.baseService.consultarPlaca(placa);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
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
  async consultarDebitos(@Body() data: PNHConsultaDebitosRequest) {
    try {
      return await this.baseService.consultaDebitos(data);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
