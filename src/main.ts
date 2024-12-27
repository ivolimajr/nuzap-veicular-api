import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as process from 'process';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuração básica do Swagger
  const config = new DocumentBuilder()
    .setTitle('API NuZap')
    .setDescription('Documentação da API de débitos veiculares')
    .setVersion('2.0')
    .addApiKey(
      { type: 'apiKey', name: 'x-api-key', in: 'header' }, // Configuração do x-api-key
      'x-api-key', // Nome do esquema de segurança
    )
    .build();
  // Criação do documento Swagger
  const document = SwaggerModule.createDocument(app, config);

  // Configuração do endpoint do Swagger
  SwaggerModule.setup('/', app, document);

  await app.listen(process.env.PORT);
}

bootstrap();
