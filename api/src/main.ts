import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFile } from 'fs';

import { promisify } from 'util';
const writeFileAsync = promisify(writeFile);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  
  const config = new DocumentBuilder()
    .setTitle('People example')
    .setDescription('The people API description')
    .setVersion('1.0')
    .addTag('people')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await writeFileAsync('../api-sdk/openapi.json', JSON.stringify(document, null, 2));
  if (!process.env.SWAGGER_GEN) {
    await app.listen(3000);
  }
}
bootstrap();
