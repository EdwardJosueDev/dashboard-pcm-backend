import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleRepository } from './repositories/role.repository';
import { ItemComboBaseDTO } from '@modules/common/interceptors/items-combo-base';
import { Role } from './entities/role.entity';

@Injectable()
export class RolesService {
  constructor(private readonly roleRepository :RoleRepository)
  {

  }
  async findAllCombo(): Promise<ItemComboBaseDTO[]>
  {
    try {
      
      const roles = await this.roleRepository.findAll(
        {
            order: [['id', 'DESC']],
            offset: 0,
            limit: 50
        }
      )
      return roles.map((entity: Role) => {
        const roleParsed: Role = entity.toJSON();
        return {
          key: roleParsed.id,
          value: roleParsed.name
        }
      })
    } catch (error) {
      console.log(error)
      throw error;
    }
  }
}
