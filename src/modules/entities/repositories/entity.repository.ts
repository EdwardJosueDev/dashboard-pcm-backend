import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { GenericCrudRepository } from 'src/modules/common/repositories/generic-crud.repository';
import { Entity } from '../entities/entity.entity';

@Injectable()
export class EntityRepository extends GenericCrudRepository<Entity> {
  constructor(
	@InjectModel(Entity)
	model: typeof Entity,
  ) {
	super(model);
  }

}
