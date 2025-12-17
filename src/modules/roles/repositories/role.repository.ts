import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { GenericCrudRepository } from 'src/modules/common/repositories/generic-crud.repository';
import { Role } from '../entities/role.entity';

@Injectable()
export class RoleRepository extends GenericCrudRepository<Role> {
  constructor(
	@InjectModel(Role)
	model: typeof Role,
  ) {
	super(model);
  }

}
