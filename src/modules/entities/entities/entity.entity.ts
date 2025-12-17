// src/entities/entity.model.ts
import {
  Column,
  Model,
  Table,
  PrimaryKey,
  AutoIncrement,
  DataType,
  CreatedAt,
  UpdatedAt,
  Comment,
} from 'sequelize-typescript';

@Table({
  tableName: 'entities',
  timestamps: true,
  underscored: true,
})
export class Entity extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
    comment: 'Identificador único de la entidad',
  })
  declare id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
    comment: 'Slug único para URLs amigables',
  })
  slug: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    comment: 'Nombre completo de la entidad',
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    comment: 'Abreviatura de la entidad',
  })
  abbreviation: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    comment: 'URL oficial de la entidad',
  })
  url: string;

  @Column({
    field: 'entity_type',
    type: DataType.STRING,
    allowNull: false,
    comment: 'Tipo de entidad (ej: ministerio, municipio, etc.)',
  })
  entityType: string;

  @Column({
    field: 'parent_entity',
    type: DataType.INTEGER,
    allowNull: true,
    comment: 'ID de la entidad padre (para jerarquías)',
  })
  parentEntity: number | null;

  @Column({
    field: 'government_level',
    type: DataType.STRING,
    allowNull: false,
    comment: 'Nivel de gobierno (nacional, regional, local, etc.)',
  })
  governmentLevel: string;

  @CreatedAt
  @Column({ field: 'created_at' })
  declare createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  declare updatedAt: Date;
}