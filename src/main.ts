// import { NestFactory, Reflector } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { JwtAuthGuard } from './modules/auth/auth.guard';
// import { envConfig } from 'config/env';

// async function bootstrap() {
  
//   const app = await NestFactory.create(AppModule);

//   const reflector = app.get(Reflector);
//   app.useGlobalGuards(new JwtAuthGuard(reflector));

//   await app.listen(envConfig.port ?? 3000);
// }
// bootstrap();

import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import * as winston from 'winston';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json, urlencoded } from 'express';
import { ValidationExceptionFilter } from './modules/common/filters/validation-exception.filter';
import { join } from 'path';
import {
  envConfig,
  metabaseConfig,
} from 'config/env';

// Winston Logger
const winstonLogger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),
  ],
});

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: '*',
    methods: 'GET,POST,PATCH,PUT,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  });

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('PCM Dashboard')
    .setDescription('API para el manejo de PCM Dashboard')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, documentFactory);

  app.setGlobalPrefix('v1');

  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  // Static files
  app.useStaticAssets(join(process.cwd(), 'public'));

  // SPA fallback
  app.use((req, res, next) => {
    if (!req.originalUrl.startsWith('/v1')) {
      res.sendFile(join(process.cwd(), 'public', 'index.html'));
    } else {
      next();
    }
  });
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.useGlobalFilters(new ValidationExceptionFilter());

  await app.listen(envConfig.port, '0.0.0.0');
  winstonLogger.log({
    level: 'info',
    message: `Application running on http://localhost:${envConfig.port}`,
  });
}

bootstrap();
