import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as process from 'process';
import { ValidationPipe } from '@nestjs/common';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    cors({
      origin: (origin, callback) => {
        const corsOrigins = process.env.CORS_ORIGINS?.split(',') || [];
        if (!origin || corsOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      methods: 'GET',
      credentials: true,
    }),
  );
  // Configuração básica do Swagger
  const config = new DocumentBuilder()
    .setTitle('API NuZap')
    .setDescription('Documentação da API de débitos veiculares')
    .setVersion('2.0')
    .addApiKey({ type: 'apiKey', name: 'x-api-key', in: 'header' }, 'x-api-key')
    .build();

  // Criação do documento Swagger
  const document = SwaggerModule.createDocument(app, config);

  // Configuração do endpoint do Swagger
  SwaggerModule.setup('/', app, document);

  app.useGlobalPipes(new ValidationPipe());
  console.info(`App in running on port: ${process.env.PORT}`);
  await app.listen(process.env.PORT);
}

bootstrap();
