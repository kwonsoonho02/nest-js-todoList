import { Column, HasMany, Model, Table } from 'sequelize-typescript';
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
  id: number;

  @Column
  email: string;

  @Column
  password: string;

  @HasMany(() => Todo, 'userId')
  todos: Todo[];
}
