// src/entities/entities.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { Entity } from './entities/entity.entity'; 
import { EntityRepository } from './repositories/entity.repository';
import { col, fn, Op, where, WhereOptions } from 'sequelize';
import { ItemComboBaseDTO } from '@modules/common/interceptors/items-combo-base';



@Injectable()
export class EntitiesService {
  constructor(
    private readonly entityRepository: EntityRepository 
  ) {}

  // Obtener todas las entidades
  async findAll(): Promise<Entity[]> {
    return this.entityRepository.findAll({
      order: [['name', 'ASC']],
    });
  }

  async findAllCombo(searchTerm: string = ""): Promise<ItemComboBaseDTO[]>
  {
    try {
      
        const whereOptions: WhereOptions<Entity> = {};

        if (searchTerm) {
          const safeTerm = searchTerm.replace(/'/g, "''");
          whereOptions[Op.or] = [
            where(fn('LOWER', col('Entity.name')), {
              [Op.like]: `%${safeTerm}%`,
            }),
            where(fn('LOWER', col('Entity.slug')), {
              [Op.like]: `%${safeTerm}%`,
            }),
          ];
        }
      const entities = await this.entityRepository.findAll(
        {
            where: whereOptions,
            order: [['id', 'DESC']],
            offset: 0,
            limit: 50
        }
      )
      return entities.map((entity: Entity) => {
        const entityParsed: Entity = entity.toJSON();
        return {
          key: entityParsed.id,
          value: entityParsed.name,
          description: entityParsed.entityType,
        }
      })
    } catch (error) {
      console.log(error)
      throw error;
    }
  }

  // Obtener una entidad por ID
  async findOne(id: number): Promise<Entity> {
    const entity = await this.entityRepository.findById(id);
    if (!entity) {
      throw new NotFoundException(`Entidad con ID ${id} no encontrada`);
    }
    return entity;
  }
}