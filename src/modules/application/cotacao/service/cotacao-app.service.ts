import { Injectable } from '@nestjs/common';
import { PnhApiService } from '../../../integration/pnh-api.service';
import { CotacaoDebitoRequest } from '../models/CotacaoDebitoRequest';
import { CotacaoDebitoResponse } from '../models/CotacaoDebitoResponse';
import { CustomException } from '../../../../middleares/CustomException';

@Injectable()
export class CotacaoAppService {
  constructor(private readonly apiService: PnhApiService) {}

  /**
   * Realiza a cotaçao de uma lista de débitos.
   * @param data Dados para consulta de débitos.
   * @return Promise<ConsultaDebitoResponse>
   */
  async cotacaoDebito(
    data: CotacaoDebitoRequest,
  ): Promise<CotacaoDebitoResponse> {
    data.cBandeira = data.cBandeira || 3;
    data.qtdParcelas = data.qtdParcelas || 24;
    this.validateRequest(data);
    return await this.apiService.cotacaoDebito(data);
  }

  private validateRequest(data: CotacaoDebitoRequest): void {
    if (!data.pedido)
      throw new CustomException(
        'O campo "pedido" é obrigatório',
        400,
        'Informe o número do pedido',
      );
    if (!data.codFaturas || data.codFaturas.length === 0)
      throw new CustomException(
        'O campo "codFaturas" é obrigatório e deve conter pelo menos um valor',
        400,
        'Informe ao menos um código de fatura',
      );
  }
}
