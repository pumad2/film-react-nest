import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import { LoggerService } from '@nestjs/common';
import { JsonLogger } from './logger/json.logger';
import { DevLogger } from './logger/dev.logger';
import { TskvLogger } from './logger/tskv.logger';

function createLogger(): LoggerService {
  switch (process.env.LOGGER_FORMAT) {
    case 'dev':
      return new DevLogger();

    case 'json':
      return new JsonLogger();

    case 'tskv':
    default:
      return new TskvLogger();
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  app.useLogger(createLogger());
  app.setGlobalPrefix('api/afisha');
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
