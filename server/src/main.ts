import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.setGlobalPrefix('/api/v1');
  app.useGlobalPipes(new ValidationPipe({transform: true}));
  app.enableCors({origin: 'http://localhost:' + configService.get('FRONTEND_PORT')})
  await app.listen(configService.get('BACKEND_PORT'));
}
bootstrap();
