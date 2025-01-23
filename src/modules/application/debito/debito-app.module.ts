import { Module } from '@nestjs/common';
import { PnhApiModule } from '../../integration/pnh-api.module';
import { DebitoAppService } from './service/debito-app.service';
import { VeiculoAppModule } from '../veiculo/veiculo-app.module';
import { DebitoModule } from '../../domain/debito/debito.module';
import { PedidoModule } from '../../domain/pedido/pedido.module';

@Module({
  imports: [PnhApiModule, DebitoModule, PedidoModule, VeiculoAppModule],
  providers: [DebitoAppService],
  exports:[DebitoAppService]
})
export class DebitoAppModule {}
