import { Module } from '@nestjs/common';
import { PnhApiModule } from '../../integration/pnh-api.module';
import { CotacaoAppService } from './service/cotacao-app.service';

@Module({
  imports: [PnhApiModule],
  providers: [CotacaoAppService],
  exports:[CotacaoAppService]
})
export class CotacaoAppModule {}
