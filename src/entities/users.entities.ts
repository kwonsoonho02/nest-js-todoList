import { Column, Model, Table } from 'sequelize-typescript';

@Table({
  tableName: 'users',
  modelName: 'User',
})
export class User extends Model {
  @Column
  userId: string;

  @Column
  email: string;

  @Column
  password: string;
}
