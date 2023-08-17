import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  Res,
  Body,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { Page } from 'src/common/page';
import { SearchGoodsDto } from 'src/dto/searchGoods.dto';
import { CreateTodoDTO, UpdateTodoDTO } from 'src/dto/todos.dto';
import { Todo } from 'src/entities/todos.entities';
import { AuthGuard } from 'src/guard/auth.guard';
import { TodoService } from 'src/services/todo.services';

@ApiTags('todos')
@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @ApiOperation({ summary: 'Get all todos' })
  @UseGuards(AuthGuard)
  @Get()
  async findTodoList(@Req() req: Request, @Query() page: SearchGoodsDto) {
    try {
      const userId: number = req['user'].id;
      const findList = await this.todoService.findTodoList(userId, page);

      return findList;
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'Create todo' })
  @UseGuards(AuthGuard)
  @Post()
  async createTodo(@Req() req: Request, @Body() todoData: CreateTodoDTO) {
    try {
      const userId: number = req['user'].id;
      console.log(userId);
      const createTodo: Todo = await this.todoService.createTodo(
        userId,
        todoData,
      );

      return createTodo;
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'Update todo' })
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
      const updateTodo: number = await this.todoService.updateTodo(
        userId,
        todoData,
        todoId,
      );

      return updateTodo;
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'Delete todo' })
  @UseGuards(AuthGuard)
  @Delete('/:id')
  async deleteTodo(@Req() req: Request, @Param('id') todoId: number) {
    try {
      const userId: number = req['user'].id;
      const deleteTodo: number = await this.todoService.deleteTodo(
        userId,
        todoId,
      );

      return deleteTodo;
    } catch (error) {
      throw error;
    }
  }
}
