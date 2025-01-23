import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Debito } from './models/debito.model';
import { DebitoService } from './service/debito.service';

@Module({
  imports: [SequelizeModule.forFeature([Debito])],
  providers: [DebitoService],
  exports: [ DebitoService],
})
export class DebitoModule {}
