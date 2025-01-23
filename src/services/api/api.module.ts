import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ApiService } from './api.service';


@Module({
  imports: [HttpModule], // Certifique-se de importar o HttpModule, pois ele é usado pelo ApiService
  providers: [ApiService],
  exports: [ApiService], // Exporte o ApiService para outros módulos
})
export class ApiModule {}
