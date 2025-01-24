import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from './controllers/app.controller';
import { HttpModule } from '@nestjs/axios';
import * as process from 'process';
import { ApiKeyMiddleware } from './middleares/key.middleware';
import { VeiculoAppModule } from './modules/application/veiculo/veiculo-app.module';
import { PnhApiModule } from './modules/integration/pnh-api.module';
import { DebitoAppModule } from './modules/application/debito/debito-app.module';
import { PedidoAppModule } from './modules/application/pedido/pedido-app.module';
import { PagamentoAppModule } from './modules/application/pagamento/pagamento-app.module';
import { DebitoModule } from './modules/domain/debito/debito.module';
import { PedidoModule } from './modules/domain/pedido/pedido.module';
import { VeiculoModule } from './modules/domain/veiculo/veiculo.module';
import { CotacaoAppModule } from './modules/application/cotacao/cotacao-app.module';

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
    DebitoModule,
    PedidoModule,
    VeiculoModule,
    PnhApiModule,
    VeiculoAppModule,
    DebitoAppModule,
    PedidoAppModule,
    PagamentoAppModule,
    CotacaoAppModule
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ApiKeyMiddleware)
      .forRoutes('*'); // Aplica para todas as rotas;
  }
}
