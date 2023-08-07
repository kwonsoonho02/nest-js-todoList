import {
  Controller,
  Delete,
  Get,
  Next,
  Param,
  Post,
  Put,
  Req,
  Res,
  Body,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CreateTodoDTO, UpdateTodoDTO } from 'src/dto/todos.dto';
import { Todo } from 'src/entities/todos.entities';
import { AuthGuard } from 'src/guard/auth.guard';
import { TodoService } from 'src/services/todo.services';

@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @UseGuards(AuthGuard)
  @Get()
  async findTodoList(@Req() req: Request, @Res() res: Response) {
    try {
      const userId: number = req['user'].id;
      console.log('아이디 : ', userId);
      const findList: Todo[] = await this.todoService.findTodoList(userId);

      res.status(200).json({ data: findList, msg: 'findAll' });
    } catch (error) {}
  }
  @UseGuards(AuthGuard)
  @Post()
  async createTodo(
    @Req() req: Request,
    @Res() res: Response,
    @Body() todoData: CreateTodoDTO,
  ) {
    try {
      const userId: number = req['user'].id;
      console.log(userId);
      const createTodo: Todo = await this.todoService.createTodo(
        userId,
        todoData,
      );

      res.status(200).json({ data: createTodo, msg: 'create' });
    } catch (error) {}
  }
  @UseGuards(AuthGuard)
  @Put('/:id')
  async updateTodo(
    @Req() req: Request,
    @Res() res: Response,
    @Body() todoData: UpdateTodoDTO,
    @Param('id') todoId: number,
  ) {
    try {
      const userId: number = req['user'].id;
      console.log(todoId);
      const updateTodo: Promise<number> = this.todoService.updateTodo(
        userId,
        todoData,
        todoId,
      );

      res.status(200).json({ data: updateTodo, msg: 'update' });
    } catch (error) {}
  }

  @UseGuards(AuthGuard)
  @Delete('/:id')
  async deleteTodo(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') todoId: number,
  ) {
    try {
      const userId: number = req['user'].id;
      const deleteTodo: number = await this.todoService.deleteTodo(
        userId,
        todoId,
      );

      res.status(200).json({ data: deleteTodo, msg: 'delete' });
    } catch (error) {}
  }
}
