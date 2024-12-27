import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { DomainModule } from './services/domain.module';
import { AppController } from './controllers/app.controller';
import { ApiService } from './services/api/api.service';
import { HttpModule } from '@nestjs/axios';
import { BaseService } from './services/application/base.service';
import * as process from 'process';
import { ApiKeyMiddleware } from './middleares/key.middleware';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot(),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT || 5432,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      models: [],
      autoLoadModels: true,
      synchronize: false,
      timezone: '-03:00',
    }),
    DomainModule,
  ],
  controllers: [AppController],
  providers: [ApiService, BaseService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ApiKeyMiddleware) // Aplica o middleware
      .forRoutes('*'); // Aplica para todas as rotas; ajuste conforme necessário
  }
}
