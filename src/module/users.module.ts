import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserControlloer } from 'src/controllers/users.controller';
import { User } from 'src/entities/users.entities';
import { UserService } from 'src/services/users.services';

@Module({
  imports: [SequelizeModule.forFeature([User])],
  controllers: [UserControlloer],
  providers: [UserService, SequelizeModule],
})
export class UserModeul {}
