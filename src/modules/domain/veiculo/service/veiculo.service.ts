import { Injectable, HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import Veiculo from '../models/veiculo.model';
import { limparDocumento } from '../../../../utils/stringUtils';

@Injectable()
export class VeiculoService {
  constructor(
    @InjectModel(Veiculo)
    private readonly veiculoModel: typeof Veiculo,
  ) {}

  /**
   * Busca um veículo pelo número da placa.
   * @param placa Placa do veículo.
   * @returns Veículo encontrado ou null.
   */
  async buscarPorPlaca(placa: string): Promise<Veiculo | null> {
    if (!placa || !placa.trim()) {
      throw new HttpException('Placa inválida', 400);
    }

    return this.veiculoModel.findOne({
      where: { placa: placa.toLowerCase() } as any,
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    });
  }

  /**
   * Cria um novo veículo no banco de dados.
   * @param data Dados do veículo.
   * @returns Veículo criado.
   */
  async inserir(data: Partial<Veiculo>): Promise<Veiculo> {
    try {
      data.placa = data.placa.toLowerCase();
      data.cpfCnpj = data.cpfCnpj ? limparDocumento(data.cpfCnpj) : null;
      return await this.veiculoModel.create(data);
    } catch (error) {
      throw new HttpException('Erro ao criar veículo', 500);
    }
  }

  async atualizar(data: Partial<Veiculo>): Promise<Veiculo>{
    try {
      data.placa = data.placa.toLowerCase();
      data.cpfCnpj = data.cpfCnpj ? limparDocumento(data.cpfCnpj) : null;
      const result = await data.update(data);
      await data.save();
      return  result;
    } catch (error) {
      throw new HttpException('Erro ao criar veículo', 500);
    }
  }
}
