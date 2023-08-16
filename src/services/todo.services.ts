import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateTodoDTO, UpdateTodoDTO } from 'src/dto/todos.dto';
import { Todo } from 'src/entities/todos.entities';

@Injectable()
export class TodoService {
  constructor(@InjectModel(Todo) private todoModel: typeof Todo) {}

  async findTodoList(userId: number, page): Promise<Todo[]> {
    const findList: Todo[] = await this.todoModel.findAll({
      where: { userId },
    });

    return findList;
  }

  async createTodo(userId: number, todoData: CreateTodoDTO): Promise<Todo> {
    const createTodo = await this.todoModel.create({ ...todoData, userId });

    return createTodo;
  }

  async updateTodo(
    userId: number,
    todoData: UpdateTodoDTO,
    todoId: number,
  ): Promise<number> {
    const todoToUpdate = await this.todoModel.findByPk(todoId);
    if (!todoToUpdate) throw new NotFoundException('투두 없어용용구리~');

    const [affectCount] = await this.todoModel.update(todoData, {
      where: { userId, id: todoId },
    });

    return affectCount;
  }

  async deleteTodo(userId: number, todoId: number): Promise<number> {
    const todoToUpdate = await this.todoModel.findByPk(todoId);
    if (!todoToUpdate) throw new NotFoundException('투두 없어용용구리~');

    const deleteTodo = await this.todoModel.destroy({
      where: { userId, id: todoId },
    });

    return deleteTodo;
  }
}
