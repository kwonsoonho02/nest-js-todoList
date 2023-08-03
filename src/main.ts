import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { jwtConstants } from './confing/jwtConstants';

async function bootstrap() {
  await jwtConstants.onApplicationBootstrap();
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  await app.listen(3000);
}
bootstrap();
