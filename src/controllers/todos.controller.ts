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
import { CreateTodoDto } from 'src/dto/todos.dto';
import { Todo } from 'src/entities/todos.entities';
import { AuthGuard } from 'src/guard/auth.guard';
import { TodoService } from 'src/services/todo.services';

@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}
  @Get()
  async findTodoList(
    @Req() req: Request,
    @Res() res: Response,
    @Body() id: number,
  ) {
    try {
      console.log(req.body.user);
      const findList: Todo[] = await this.todoService.findTodoList(id);

      res.status(200).json({ data: findList, msg: 'findAll' });
    } catch (error) {}
  }

  @Post()
  async createTodo(
    @Req() req: Request,
    @Res() res: Response,
    @Body() todoData: CreateTodoDto,
    @Body() id: number,
  ) {
    try {
      const createTodo = await this.todoService.createTodo(id, todoData);

      res.status(200).json({ data: createTodo, msg: 'create' });
    } catch (error) {}
  }
  @UseGuards(AuthGuard)
  @Put(':id')
  async updateTodo(
    @Req() req: Request,
    @Res() res: Response,
    @Body() todoData: CreateTodoDto,
    @Param('id') id: number,
  ) {
    try {
      const updateTodo = this.todoService.updateTodo(id, todoData);

      res.status(200).json({ data: updateTodo, msg: 'update' });
    } catch (error) {}
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteTodo(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id: number,
  ) {
    try {
      const deleteTodo = await this.todoService.deleteTodo(id);

      res.status(200).json({ data: deleteTodo, msg: 'delete' });
    } catch (error) {}
  }
}
