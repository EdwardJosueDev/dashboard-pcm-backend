import { Module } from '@nestjs/common';
import { EntitiesService } from './entities.service';
import { EntitiesController } from './entities.controller';
import { Entity } from './entities/entity.entity';
import { SequelizeModule } from '@nestjs/sequelize';
import { EntityRepository } from './repositories/entity.repository';

@Module({
  imports: [SequelizeModule.forFeature([Entity])],
  controllers: [EntitiesController],
  providers: [EntitiesService, EntityRepository],
})
export class EntitiesModule {}
