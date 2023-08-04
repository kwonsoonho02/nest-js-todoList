import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateTodoDto } from 'src/dto/todos.dto';
import { Todo } from 'src/entities/todos.entities';

@Injectable()
export class TodoService {
  userModel: any;
  constructor(@InjectModel(Todo) private todoModel: typeof Todo) {}

  async findTodoList(id: number): Promise<Todo[]> {
    const findUser: Todo = await this.userModel.findByPk(id);
    if (!findUser) throw new HttpException('유저 없음', HttpStatus.NOT_FOUND);

    const findList: Todo[] = await this.todoModel.findAll({
      where: { userId: findUser.id },
    });

    return findList;
  }

  async createTodo(id: number, todoData: CreateTodoDto): Promise<Todo> {
    const createTodo = await this.todoModel.create({ ...todoData, userId: id });

    return createTodo;
  }

  async updateTodo(id: number, todoData: CreateTodoDto): Promise<number> {
    const findUser = await this.userModel.findByPk(id);
    if (!findUser) throw new HttpException('유저 없음', HttpStatus.NOT_FOUND);

    const [affectCount] = await this.todoModel.update(
      { ...todoData },
      { where: { userId: findUser.id } },
    );

    return affectCount;
  }

  async deleteTodo(id: number): Promise<number> {
    const findUser = await this.userModel.findByPk(id);
    if (!findUser) throw new HttpException('유저 없음', HttpStatus.NOT_FOUND);

    const deleteTodo = await this.todoModel.destroy({ where: { id } });

    return deleteTodo;
  }
}
