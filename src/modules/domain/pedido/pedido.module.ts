import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Pedido } from './models/pedido.model';
import { PedidoService } from './service/pedido.service';

@Module({
  imports: [SequelizeModule.forFeature([Pedido])],
  providers: [PedidoService],
  exports: [ PedidoService],
})
export class PedidoModule {}
