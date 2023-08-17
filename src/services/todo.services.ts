import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Page } from 'src/common/page';
import { SearchGoodsDto } from 'src/dto/searchGoods.dto';
import { CreateTodoDTO, UpdateTodoDTO } from 'src/dto/todos.dto';
import { Todo } from 'src/entities/todos.entities';

@Injectable()
export class TodoService {
  constructor(@InjectModel(Todo) private todoModel: typeof Todo) {}

  // async findTodoList(
  //   userId: number,
  //   page: SearchGoodsDto,
  // ): Promise<Page<Todo>> {
  //   const totalCount = await this.todoModel.count({ where: { userId } });
  //   const findList: Todo[] = await this.todoModel.findAll({
  //     where: { userId },
  //     limit: page.getLimit(),
  //     offset: page.getOffset(),
  //   });

  //   const totalPage = Math.ceil(totalCount / page.pageSize);
  //   const resultPage = new Page(page.pageSize, totalCount, totalPage, findList);

  //   return resultPage;
  // }

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
    const findTodoId = await this.todoModel.findByPk(todoId);
    if (!findTodoId) throw new NotFoundException('투두 없어용용구리~');

    const [affectCount] = await this.todoModel.update(todoData, {
      where: { userId, id: todoId },
    });

    return affectCount;
  }

  async deleteTodo(userId: number, todoId: number): Promise<number> {
    const findTodoId = await this.todoModel.findByPk(todoId);
    if (!findTodoId) throw new NotFoundException('투두 없어용용구리~');

    const deleteTodo = await this.todoModel.destroy({
      where: { userId, id: todoId },
    });

    return deleteTodo;
  }
}
