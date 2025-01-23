import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PnhApiService } from './pnh-api.service';


@Module({
  imports: [HttpModule], // Certifique-se de importar o HttpModule, pois ele é usado pelo PnhApiService
  providers: [PnhApiService],
  exports: [PnhApiService], // Exporte o PnhApiService para outros módulos
})
export class PnhApiModule {}
