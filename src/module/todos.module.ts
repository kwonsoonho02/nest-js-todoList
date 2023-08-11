import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from './auth.module';
import { TodoController } from 'src/controllers/todos.controller';
import { TodoService } from 'src/services/todo.services';
import { Todo } from 'src/entities/todos.entities';

import { AuthGuard } from 'src/guard/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { RefreshGuard } from 'src/guard/refresh.gaurd';

@Module({
  imports: [SequelizeModule.forFeature([Todo]), AuthModule],
  controllers: [TodoController],
  providers: [TodoService, AuthGuard, JwtService, RefreshGuard],
})
export class TodoModule {}
