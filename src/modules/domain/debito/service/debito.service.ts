import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Debito } from '../models/debito.model';

@Injectable()
export class DebitoService {
  constructor(
    @InjectModel(Debito)
    private readonly debitoModel: typeof Debito,
  ) {}

  async create(data: Partial<Debito>): Promise<Debito> {
    try {
      return await this.debitoModel.create(data);
    } catch (error) {
      throw new HttpException('Erro ao criar veículo', 500);
    }
  }

  async createAll(data: Partial<Debito>[]): Promise<Debito[]> {
    try {
      return await this.debitoModel.bulkCreate(data, { returning: true });
    } catch (error) {
      throw new HttpException('Erro ao criar débitos', 500);
    }
  }
}
