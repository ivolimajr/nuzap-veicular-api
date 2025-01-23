import { Module } from '@nestjs/common';
import { PnhApiModule } from '../../integration/pnh-api.module';
import { PedidoAppService } from './service/pedido-app.service';
import { PedidoModule } from '../../domain/pedido/pedido.module';

@Module({
  imports: [PnhApiModule, PedidoModule],
  providers: [PedidoAppService],
  exports:[PedidoAppService]
})
export class PedidoAppModule {}
