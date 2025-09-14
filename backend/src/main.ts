 import 'reflect-metadata';
import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: true,
      credentials: true,
      methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    },
  });

  app.setGlobalPrefix('api');

  await app.listen(process.env.PORT ? Number(process.env.PORT) : 3001);
  // eslint-disable-next-line no-console
  console.log(`API running on http://localhost:${process.env.PORT || 3001}/api`);
}
bootstrap();
