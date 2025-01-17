import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  //for dto
  app.useGlobalPipes(new ValidationPipe({whitelist:true}));
  app.enableCors({
    origin: 'http://localhost:4200',  
    allowedHeaders: 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Observe, Authorization',
    methods: "GET,PUT,POST,DELETE,UPDATE,OPTIONS",
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe());

  app.use(cookieParser());
  await app.listen(5000);
}
bootstrap();
