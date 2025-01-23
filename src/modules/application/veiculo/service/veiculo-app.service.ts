import { Injectable } from '@nestjs/common';
import { CustomException } from '../../../../middleares/CustomException';
import { exists, getDigits } from '../../../../utils/stringUtils';
import { PnhApiService } from '../../../integration/pnh-api.service';
import Veiculo from '../../../domain/veiculo/models/veiculo.model';
import { PNHConsultaPlacaResponse } from '../../../integration/models';
import { VeiculoService } from '../../../domain/veiculo/service/veiculo.service';
import { ConsultaPlacaResponse } from '../models';
import { RequisitosPorUF } from '../../../../utils/const';

@Injectable()
export class VeiculoAppService {

  private readonly requisitosPorUF: Record<string, string[]> = RequisitosPorUF;

  constructor(
    private readonly apiService: PnhApiService,
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

      this.valididateApiResponse(apiResponse);

      const _veiculo = {
        ...apiResponse.resposta,
        renavam: apiResponse.resposta.renavam || renavam,
        chassi: apiResponse.resposta.chassi || chassi,
        cpfCnpj: apiResponse.resposta.cpfCnpj || documento,
        anoFabricacao: apiResponse.resposta.ano_fabricacao,
      };

      const dbResult = await this.veiculoService.inserir(_veiculo);

      return this.mapVeiculoToResponse(dbResult);
    } catch (e) {
      throw e;
    }
  }

  /**
   * Caso não venha nenhum dado da API, retorna que o service não foi encontrado
   */
  private valididateApiResponse(apiResponse: PNHConsultaPlacaResponse): void{
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

    if (
      !apiResponse.resposta.chassi &&
      !apiResponse.resposta.uf &&
      !apiResponse.resposta.marcaModelo &&
      !apiResponse.resposta.cpfCnpj
    )
      throw new CustomException(
        'Informações do veículos insuficientes',
        404,
        'Não tivemos informações suficientes sobre o service',
        apiResponse,
      );
  }

  /**
   * Mapeia um obj do tipo service para o tipo de resposta do serviço
   * @param veiculo
   * @type Veiculo
   * @return ConsultaPlacaResponse
   */
  private mapVeiculoToResponse(veiculo: Veiculo) {
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
      pendentes: this.verificarPendencias(veiculo)
    };
  }

  private verificarPendencias(veiculo: Veiculo): string[] {
    const requisitos = this.requisitosPorUF[veiculo.uf.toUpperCase()] || [];
    const pendentes: string[] = [];

    requisitos.forEach((campo) => {
      const valor = veiculo[campo];
      if (!valor || valor.trim() === "") {
        pendentes.push(campo);
      }
    });

    return pendentes;
  }
}
