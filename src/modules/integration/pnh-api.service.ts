import { Injectable, HttpException } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { Buffer } from 'buffer';
import { AxiosResponse } from 'axios';
import { HttpService } from '@nestjs/axios';
import * as process from 'process';
import {
  PNHConsultaPlacaResponse,
  PNHProcessaPagamentoResponse,
  PNHConsultaDebitoResponse,
  PNHProcessaPagamentoRequest,
  PNHConsultaDebitoRequest,
  PNHConsultaPedidoResponse,
  PNHAutenticacaoResponse,
} from './models';
import {
  PNHMockConsultaDebitoResponse,
  PNHMockPagamentoResponse,
} from '../../mock/PNHMock';
import { CustomException } from '../../middleares/CustomException';
import { exists } from '../../utils/stringUtils';
import { PNHCotacaoDebitoRequest } from './models/cotacaoDebito/PNHCotacaoDebitoRequest';
import { PNHCotacaoDebitoResponse } from './models/cotacaoDebito/PNHCotacaoDebitoResponse';

@Injectable()
export class PnhApiService {
  private token: string = null;
  private tokenExpiresAt: number = 0;
  private baseUrl: string = process.env.PNH_BASE_URL;
  private apiVersion: string = process.env.PNH_API_VERSION;
  private apiAuthVersion: string = process.env.PNH_API_AUTH_VERSION;
  private email: string = process.env.PNH_CLIENT_ID;
  private password: string = process.env.PNH_CLIENT_SECRET;

  constructor(private readonly httpService: HttpService) {}

  /**
   * Busca o token atual válido ou gera um novo token.
   * @return String
   * @example eyJhbGciOiJIUzI1NiIsInR5cCI.....
   */
  async getToken(): Promise<string> {
    if (this.token && this.tokenExpiresAt > Date.now()) return this.token;

    return await this.generateToken();
  }

  /**
   * Requisita na API da Parcele na Hora as informações de um veículo
   * @param placa
   * @type string
   * @return Promise<PNHConsultaPlacaResponse>
   */
  async consultarPlaca(placa: string): Promise<PNHConsultaPlacaResponse> {
    const token = await this.getToken();
    const url = `${this.baseUrl}/api/${this.apiVersion}/ConsultaPlaca`;

    try {
      const response: AxiosResponse<PNHConsultaPlacaResponse> =
        await lastValueFrom(
          this.httpService.post(
            url,
            { placa },
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          ),
        );
      return response.data;
    } catch (error) {
      throw new CustomException(
        error.message,
        error.response?.status || 500,
        'Falha na consulta de placa',
        error.response?.data,
      );
    }
  }

  /**
   * Requisita na API da Parcele na Hora a lista de todos os débitos de um veículo
   * @param data
   * @type PNHConsultaDebitoRequest
   * @return Promise<PNHConsultaDebitoResponse>
   */
  async consultaDebitos(
    data: PNHConsultaDebitoRequest,
  ): Promise<PNHConsultaDebitoResponse> {
    // return PNHMockConsultaDebitoResponse;
    const token = await this.getToken();
    const url = `${this.baseUrl}/api/${this.apiVersion}/ConsultaDebito`;

    try {
      const response: AxiosResponse<PNHConsultaDebitoResponse> =
        await lastValueFrom(
          this.httpService.post(url, data, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        );

      if (!response.data.success)
        throw new CustomException(
          response.data.message,
          400,
          'Favor, tente novamente mais tarde',
          response.data,
        );

      return response.data;
    } catch (error) {
      let userMessage = 'Falha na consulta de débitos';
      if (error.response.data) {
        if (
          error.response.data.message &&
          exists(error.response.data.message, 'Detran está indisponível')
        ) {
          userMessage =
            'O sistema do Detran está indisponível, tente novamente mais tarde !';

          error.message =
            'O sistema do Detran está indisponível, tente novamente mais tarde !';
        }
      }
      throw new CustomException(
        error.message,
        error.response?.status || 500,
        userMessage,
        error.response?.data,
      );
    }
  }

  /**
   * Requisita na API da Parcele na Hora a lista o status de um pedido
   * @param numeroPedido
   * @type Number
   * @return Promise<PNHConsultaPedidoResponse>
   */
  async consultarStatusPedido(
    numeroPedido: number,
  ): Promise<PNHConsultaPedidoResponse> {
    const token = await this.getToken();
    const url = `${this.baseUrl}/api/${this.apiVersion}/pagamento/ConsultarStatusPedido?CodigoPedido=${numeroPedido}`;

    try {
      const response: AxiosResponse<PNHConsultaPedidoResponse> =
        await lastValueFrom(
          this.httpService.get(url, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        );

      return response.data;
    } catch (error) {
      throw new CustomException(
        error.message,
        error.response?.status || 500,
        'Falha na consulta de status do pedido',
        error.response?.data,
      );
    }
  }

  async processaPagamento(
    data: PNHProcessaPagamentoRequest,
  ): Promise<PNHProcessaPagamentoResponse> {
    // return PNHMockPagamentoResponse as PNHProcessaPagamentoResponse;
    const token = await this.getToken();
    const url = `${this.baseUrl}/api/${this.apiVersion}/pagamento`;

    try {
      const response: AxiosResponse<PNHProcessaPagamentoResponse> =
        await lastValueFrom(
          this.httpService.post(url, data, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        );

      return response.data;
    } catch (error) {
      throw new CustomException(
        error.message,
        error.response?.status || 500,
        'Falha ao processar pagamento',
        error.response?.data,
      );
    }
  }


  async cotacaoDebito(
    data: PNHCotacaoDebitoRequest,
  ): Promise<PNHCotacaoDebitoResponse> {
    const token = await this.getToken();
    const url = `${this.baseUrl}/api/${this.apiVersion}/CotacaoDebito`;

    try {
      const response: AxiosResponse<PNHCotacaoDebitoResponse> =
        await lastValueFrom(
          this.httpService.post(url, data, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        );

      return response.data;
    } catch (error) {
      throw new CustomException(
        error.message,
        error.response?.status || 500,
        'Falha ao processar cotação',
        error.response?.data,
      );
    }
  }

  /**
   * Injeta nas pripriedades dessa classe o token e a validade do token
   * @param token
   * @type String
   * @return void
   */
  private setTokenProperties(token: string): void {
    if (token) {
      const decoded: any = JSON.parse(
        Buffer.from(token.split('.')[1], 'base64').toString(),
      );
      this.token = token;
      this.tokenExpiresAt = decoded.exp * 1000;
    } else {
      this.token = null;
      this.tokenExpiresAt = 0;
    }
  }

  /**
   * Busca um token válido na API da Parcele na Hora e
   * depois injeta o retorno as propriedades dessa classe
   *
   * @return Promise<string>
   */
  private async generateToken(): Promise<string> {
    const url = `${this.baseUrl}/login/${this.apiAuthVersion}/login`;
    try {
      const response: AxiosResponse<PNHAutenticacaoResponse> =
        await lastValueFrom(
          this.httpService.post(url, {
            email: this.email,
            senha: this.password,
          }),
        );
      const token = response.data.token;
      this.setTokenProperties(token);
      return token;
    } catch (error) {
      throw new HttpException(
        'Falha na autenticação',
        error.response?.status || 500,
      );
    }
  }
}
