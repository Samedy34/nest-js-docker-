import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('My API') // Заголовок документации
    .setDescription('The API description') // Описание
    .setVersion('1.0') // Версия API
    .addTag('users') // Добавление тегов для группировки методов
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // Доступ к Swagger UI по URL: /api

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
