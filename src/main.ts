import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as mongoose from 'mongoose'
import * as session from 'express-session';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  mongoose.connect('mongodb://localhost/iceymoon-blog-api', {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true
  }).catch(err => { console.log(err) })
  const app = await NestFactory.create(AppModule);

  app.use(session({
    secret: 'iceymoon',
    name: 'name',
    resave: false
  }))
  app.useGlobalPipes(new ValidationPipe())

  const options = new DocumentBuilder()
    .setTitle('iceymoon-blog-api')
    .setDescription('博客API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(3000);
}
bootstrap();
