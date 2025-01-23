import { Module } from '@nestjs/common';
import { VeiculoAppService } from './service/veiculo-app.service';
import { PnhApiModule } from '../../integration/pnh-api.module';
import { VeiculoModule } from '../../domain/veiculo/veiculo.module';

@Module({
  imports: [PnhApiModule, VeiculoModule],
  providers: [VeiculoAppService],
  exports:[VeiculoAppService]
})
export class VeiculoAppModule {}
