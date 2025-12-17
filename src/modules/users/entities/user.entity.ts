// src/users/user.model.ts
import {
  Column,
  Model,
  Table,
  PrimaryKey,
  AutoIncrement,
  DataType,
  Unique,
  AllowNull,
  ForeignKey,
  BelongsTo,
  DefaultScope,
  Scopes,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import { Entity } from 'src/modules/entities/entities/entity.entity';
import { Role } from 'src/modules/roles/entities/role.entity';

@DefaultScope(() => ({
  attributes: { exclude: ['password'] }, 
}))
@Scopes(() => ({
  withPassword: {
    attributes: { include: ['password'] }, 
  },
}))
@Table({
  tableName: 'users',
  timestamps: true,
  paranoid: true,
  underscored: true, 
})
export class User extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
    comment: 'Identificador único del usuario',
  })
  declare id: number;

  @Column({
    field: 'full_name',
    type: DataType.STRING,
    allowNull: false,
    comment: 'Nombre completo del usuario',
  })
  fullName: string;

  @Unique
  @Column({
    type: DataType.STRING,
    allowNull: false,
    comment: 'Correo electrónico único del usuario',
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    comment: 'Teléfono del usuario',
  })
  phone: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    comment: 'Contraseña hasheada',
  })
  password: string;

  @ForeignKey(() => Entity)
  @Column({
    field: 'entity_id',
    type: DataType.INTEGER,
    allowNull: true,
    comment: 'Entidad a la que pertenece el usuario',
  })
  entityId?: number;

  @BelongsTo(() => Entity)
  entity: Entity;

  @ForeignKey(() => Role)
  @Column({
    field: 'role_id',
    type: DataType.INTEGER,
    allowNull: false,
    comment: 'id Rol asignado al usuario',
  })
  roleId: number;

  @BelongsTo(() => Role)
  role: Role;

  @CreatedAt
  @Column({ field: 'created_at' })
  declare createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  declare updatedAt: Date;
}