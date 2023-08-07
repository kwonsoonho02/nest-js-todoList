import {
  Column,
  Model,
  Table,
  ForeignKey,
  BelongsTo,
  DataType,
  AllowNull,
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

  @Column({ allowNull: false })
  title: string;

  @Column({ allowNull: false })
  content: string;

  @Column
  userId: number;

  @Column({ allowNull: true, type: DataType.DATE })
  createdAt?: Date;

  @Column({ allowNull: true, type: DataType.DATE })
  updatedAt?: Date;

  @BelongsTo(() => User, 'userId')
  user?: User;
}
