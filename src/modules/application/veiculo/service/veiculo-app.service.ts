import { Injectable } from '@nestjs/common';
import { ConsultaPlacaResponse } from '../../../../models/application';
import { CustomException } from '../../../../middleares/CustomException';
import { exists, getDigits } from '../../../../utils/stringUtils';
import { ApiService } from '../../../../services/api/api.service';
import {
  VeiculoService,
} from '../../../../services/domain';
import Veiculo from '../../../../models/domain/veiculo.model';

@Injectable()
export class VeiculoAppService {

  constructor(
    private readonly apiService: ApiService,
    private readonly veiculoService: VeiculoService,
  ) {}

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
        documento: apiResponse.resposta.cpfCnpj || documento,
        anoFabricacao: apiResponse.resposta.ano_fabricacao,
      };

      const dbResult = await this.veiculoService.inserir(_veiculo);

      return this.mapVeiculoToResponse(dbResult);
    } catch (e) {
      throw e;
    }
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
}
