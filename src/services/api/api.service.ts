import { Injectable, HttpException } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { Buffer } from 'buffer';
import { AxiosResponse } from 'axios';
import { HttpService } from '@nestjs/axios';
import * as process from 'process';
import { PNHConsultaPlacaResponse } from '../../models/api/consultaPlaca/PNHConsultaPlacaResponse';
import { PNHConsultaDebitosRequest } from '../../models/api/consultaDebito/PNHConsultaDebitosRequest';
import { PNHConsultaDebitosResponse } from '../../models/api/consultaDebito/PNHConsultaDebitosResponse';
import { PNHConsultaPedidoResponse } from '../../models/api/consultaPedido/PNHConsultaPedidoResponse';
import { PNHAutenticacaoResponse } from '../../models/api/autenticacao/PNHAutenticacaoResponse';

@Injectable()
export class ApiService {
  private token: string = null;
  private tokenExpiresAt: number = 0;
  private baseUrl: string = process.env.EPS_BASE_URL;
  private apiVersion: string = process.env.EPS_API_VERSION;
  private apiAuthVersion: string = process.env.EPS_API_AUTH_VERSION;

  constructor(private readonly httpService: HttpService) {}

  async getToken(): Promise<string> {
    if (this.token && this.tokenExpiresAt > Date.now()) {
      return this.token;
    }
    return await this.generateToken();
  }

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
      console.log(error);
      throw new HttpException(
        'Falha na consulta de placa',
        error.response?.status || 500,
      );
    }
  }

  async consultaDebitos(
    data: PNHConsultaDebitosRequest,
  ): Promise<PNHConsultaDebitosResponse> {
    // return PNHMockConsultaDebitoResponse;
    const token = await this.getToken();
    const url = `${this.baseUrl}/api/${this.apiVersion}/ConsultaDebito`;

    try {
      const response: AxiosResponse<PNHConsultaDebitosResponse> =
        await lastValueFrom(
          this.httpService.post(url, data, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        );

      return response.data;
    } catch (error) {
      throw new HttpException(
        'Falha na consulta de débitos',
        error.response?.status || 500,
      );
    }
  }

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
      throw new HttpException(
        'Falha na consulta de status do pedido',
        error.response?.status || 500,
      );
    }
  }

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

  private async generateToken(): Promise<string> {
    const url = `${this.baseUrl}/login/${this.apiAuthVersion}/login`;
    try {
      const response: AxiosResponse<PNHAutenticacaoResponse> =
        await lastValueFrom(
          this.httpService.post(url, {
            email: process.env.EPS_CLIENT_ID,
            senha: process.env.EPS_CLIENT_SECRET,
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
