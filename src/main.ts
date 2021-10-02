import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { createDocument } from './swagger/swagger.create-document';
import { customOptions } from './swagger/swagger.custom-options';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  SwaggerModule.setup('api/v1', app, createDocument(app), customOptions);

  await app.listen(3000);
}
bootstrap();
