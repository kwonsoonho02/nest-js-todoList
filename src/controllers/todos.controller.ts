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
  UseFilters,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { Page } from 'src/common/page';
import { SearchGoodsDto } from 'src/dto/searchGoods.dto';
import { CreateTodoDTO, UpdateTodoDTO } from 'src/dto/todos.dto';
import { Todo } from 'src/entities/todos.entities';
import { HttpExceptionFilter } from 'src/filter/httpExceptionFilter';
import { AuthGuard } from 'src/guard/auth.guard';
import { TodoService } from 'src/services/todo.services';

@ApiTags('todos')
@Controller('todos')
@UseFilters(HttpExceptionFilter)
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @ApiOperation({ summary: 'Get all todos' })
  @UseGuards(AuthGuard)
  @Get()
  async findTodoList(@Req() req: Request, @Query() page: SearchGoodsDto) {
    const userId: number = req['user'].id;
    const findLists: Page<Todo> = await this.todoService.findTodoList(
      userId,
      page,
    );

    if (!findLists) {
      throw new HttpException(
        'Failed to find lists',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return findLists;
  }

  @ApiOperation({ summary: 'Create todo' })
  @UseGuards(AuthGuard)
  @Post()
  async createTodo(@Req() req: Request, @Body() todoData: CreateTodoDTO) {
    const userId: number = req['user'].id;
    console.log(userId);
    const createTodo: Todo = await this.todoService.createTodo(
      userId,
      todoData,
    );

    if (!createTodo) {
      throw new HttpException(
        'Failed to create list',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return createTodo;
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
    const userId: number = req['user'].id;
    const updateTodo: number = await this.todoService.updateTodo(
      userId,
      todoData,
      todoId,
    );

    if (!updateTodo) {
      throw new HttpException(
        'Failed to update list',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return updateTodo;
  }

  @ApiOperation({ summary: 'Delete todo' })
  @UseGuards(AuthGuard)
  @Delete('/:id')
  async deleteTodo(@Req() req: Request, @Param('id') todoId: number) {
    const userId: number = req['user'].id;
    const deleteTodo: number = await this.todoService.deleteTodo(
      userId,
      todoId,
    );

    if (!deleteTodo) {
      throw new HttpException(
        'Failed to delete list',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return deleteTodo;
  }
}
