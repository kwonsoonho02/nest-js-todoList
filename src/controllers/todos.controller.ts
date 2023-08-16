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
import { SearchGoodsDto } from 'src/dto/searchGoods.dto';
import { CreateTodoDTO, UpdateTodoDTO } from 'src/dto/todos.dto';
import { Todo } from 'src/entities/todos.entities';
import { AuthGuard } from 'src/guard/auth.guard';
import { RefreshGuard } from 'src/guard/refresh.guard';
import { TodoService } from 'src/services/todo.services';

@ApiTags('todos')
@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @ApiOperation({ summary: 'Get all todos' })
  @UseGuards(AuthGuard)
  @Get()
  async findTodoList(
    @Req() req: Request,
    @Res() res: Response,
    @Query() page: SearchGoodsDto,
  ) {
    try {
      const userId: number = req['user'].id;
      console.log('아이디 : ', userId);
      const cookie = req.cookies.refreshToken;
      console.log('리프래쉬 : ', cookie);
      const findList: Todo[] = await this.todoService.findTodoList(
        userId,
        page,
      );

      res.status(200).json({ data: findList, msg: 'findAll' });
    } catch (error) {}
  }

  @ApiOperation({ summary: 'Create todo' })
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
      console.log(todoId);
      const updateTodo: Promise<number> = this.todoService.updateTodo(
        userId,
        todoData,
        todoId,
      );

      res.status(200).json({ data: updateTodo, msg: 'update' });
    } catch (error) {}
  }

  @ApiOperation({ summary: 'Delete todo' })
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
