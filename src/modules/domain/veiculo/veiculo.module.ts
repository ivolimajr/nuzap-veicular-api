import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import Veiculo from './models/veiculo.model';
import { VeiculoService } from './service/veiculo.service';

@Module({
  imports: [SequelizeModule.forFeature([Veiculo])],
  providers: [VeiculoService],
  exports: [ VeiculoService],
})
export class VeiculoModule {}
