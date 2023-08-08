import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Todo } from './todos.entities';
import { InferAttributes, InferCreationAttributes } from 'sequelize';

@Table({
  tableName: 'users',
  modelName: 'User',
})
export class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  @Column({ primaryKey: true, autoIncrement: true })
  userId: number;

  @Column
  email: string;

  @Column
  password: string;

  @Column({ allowNull: true, type: DataType.DATE })
  createdAt?: Date;

  @Column({ allowNull: true, type: DataType.DATE })
  updatedAt?: Date;

  // @Column({ allowNull: true })
  // currentRefreshToken: string;

  @HasMany(() => Todo)
  todos: Todo[];
}
