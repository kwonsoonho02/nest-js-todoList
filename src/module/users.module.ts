import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserController } from 'src/controllers/users.controller';
import { User } from 'src/entities/users.entities';
import { UserService } from 'src/services/users.services';

@Module({
  imports: [SequelizeModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService, SequelizeModule],
})
export class UserModeul {}
