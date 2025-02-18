import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import * as express from 'express';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('My API')
    .setDescription('The API description')
    .setVersion('1.0')
    .addTag('users')
    .addTag('auth')
    .addTag('profile')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.use('/qrcodes', express.static(join(__dirname, '../qrcodes')));
  app.use('/cards', express.static(join(__dirname, '../cards')));

  await app.listen(process.env.APP_PORT);
}
bootstrap();
