import {
  Column,
  Model,
  Table,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from './users.entities';
import { InferAttributes, InferCreationAttributes } from 'sequelize';

@Table({
  tableName: 'todos',
  modelName: 'Todo',
})
export class Todo extends Model<
  InferAttributes<Todo>,
  InferCreationAttributes<Todo>
> {
  @ForeignKey(() => User)
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column
  title: string;

  @Column
  content: string;

  @Column
  userId: number;

  @BelongsTo(() => User, 'userId')
  user?: User;
}
