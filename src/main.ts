import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {cors: true});
  const config = new DocumentBuilder()
  .setTitle('Time-Scheduler Backend')
  .setDescription('API for the Time-Scheduler Application')
  .setVersion('1.0')
  .addTag('Time-Scheduler')
  .build()
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.enableCors({
    origin: '*'
  });
  app.use(cookieParser());
  await app.listen(3000);
}
bootstrap();
