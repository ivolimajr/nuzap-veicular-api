import { Module } from '@nestjs/common';
import { VeiculoAppService } from './service/veiculo-app.service';
import { ApiModule } from '../../../services/api/api.module';
import { DomainModule } from '../../../services/domain.module';

@Module({
  imports: [ApiModule, DomainModule],
  providers: [VeiculoAppService]
})
export class VeiculoModule {}
