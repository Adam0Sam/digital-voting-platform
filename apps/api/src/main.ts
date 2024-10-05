import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.setGlobalPrefix('api');
  const configService = app.get(ConfigService);

  app.enableCors({
    origin: configService.get('CLIENT_URL'),
  });

  await app.listen(configService.get('PORT') ?? 3000);
}
bootstrap();
