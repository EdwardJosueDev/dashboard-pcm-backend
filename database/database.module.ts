import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SequelizeHooksProvider } from './sequelize-hooks.provider';
import { dbConfig, envConfig } from 'config/env';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      timezone: '-05:00',
      host: dbConfig.host,
      port: dbConfig.port,
      username: dbConfig.user,
      password: dbConfig.pass,
      database: dbConfig.name,
      autoLoadModels: true,
      synchronize: false,
      logging: false,
      retryAttempts: 5,
      dialectOptions: {
        connectTimeout: 20000,
      },
      retryDelay: 3000,
      pool: {
        max: 20, 
        min: 5,
        acquire: 30000,
        idle: 10000, 
      },
    }),
  ],
  providers: [SequelizeHooksProvider],
  exports: [SequelizeModule],
})
export class DatabaseModule {}
