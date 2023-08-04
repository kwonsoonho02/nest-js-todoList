import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from './auth.module';
import { TodoController } from 'src/controllers/todos.controller';
import { TodoService } from 'src/services/todo.services';
import { Todo } from 'src/entities/todos.entities';

import { AuthGuard } from 'src/guard/auth.guard';

@Module({
  imports: [SequelizeModule.forFeature([Todo]), AuthModule],
  controllers: [TodoController],
  providers: [TodoService, AuthGuard],
})
export class TodoModule {}
