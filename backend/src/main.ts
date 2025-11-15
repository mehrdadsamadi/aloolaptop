import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { swaggerConfigInit } from './common/config/swagger.config';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import * as compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // --- Config Service برای دسترسی به env ---
  const configService = app.get(ConfigService);
  const PORT = parseInt(configService.get<string>('PORT', '4000'), 10);
  const URL = configService.get<string>('URL', 'http://localhost');

  // --- امنیت و بهینه‌سازی ---
  app.use(
    helmet({
      contentSecurityPolicy: true,
      crossOriginEmbedderPolicy: false,
    }),
  );
  app.use(compression());
  app.enableCors({
    origin: configService.get<string>('FRONTEND_URL', '*'), // یا دامنه خاص فرانت
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // --- Global Prefix ---
  app.setGlobalPrefix('api');

  // --- Swagger ---
  swaggerConfigInit(app);

  // --- ValidationPipe global ---
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // --- Global Exception Filter ---
  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(PORT, () => {
    console.table({
      'Local Server': `${URL}:${PORT}`,
      'Swagger Docs': `${URL}:${PORT}/api-docs`,
    });
  });
}
bootstrap();
