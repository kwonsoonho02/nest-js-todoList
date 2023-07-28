import {
  Controller,
  Delete,
  Get,
  Next,
  Post,
  Put,
  Req,
  Res,
} from '@nestjs/common';
import { Request } from 'express';
import { TodoService } from 'src/services/todo.services';

@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}
  @Get()
  async findTodoList(@Req() req: Request, @Res() res: Response) {
    try {
    } catch (error) {}
  }

  @Post()
  async createTodo(@Req() req: Request, @Res() res: Response) {
    return 'create';
  }

  @Put()
  async updateTodo(@Req() req: Request, @Res() res: Response) {
    return 'update';
  }
  @Delete()
  async deleteTodo(@Req() req: Request, @Res() res: Response) {
    return 'update';
  }
}
