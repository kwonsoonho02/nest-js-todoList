import {
  Column,
  Model,
  Table,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from './users.entities';

@Table({
  tableName: 'todos',
  modelName: 'Todo',
})
export class Todo extends Model {
  @ForeignKey(() => User)
  @Column({ primaryKey: true })
  id: number;

  @Column
  title: string;

  @Column
  content: string;

  @BelongsTo(() => User, 'id')
  userId: User;
}
