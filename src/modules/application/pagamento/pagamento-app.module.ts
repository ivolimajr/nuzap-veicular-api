import { Module } from '@nestjs/common';
import { PnhApiModule } from '../../integration/pnh-api.module';
import { PagamentoAppService } from './service/pagamento-app.service';
import { PedidoAppModule } from '../pedido/pedido-app.module';
import { PedidoModule } from '../../domain/pedido/pedido.module';

@Module({
  imports: [PnhApiModule, PedidoModule, PedidoAppModule],
  providers: [PagamentoAppService],
  exports:[PagamentoAppService]
})
export class PagamentoAppModule {}
