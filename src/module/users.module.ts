import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserController } from 'src/controllers/users.controller';
import { User } from 'src/entities/users.entities';
import { UserService } from 'src/services/users.services';
import { AuthModule } from './auth.module';
import { AuthGuard } from 'src/guard/auth.guard';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [SequelizeModule.forFeature([User]), AuthModule],
  controllers: [UserController],
  providers: [UserService, AuthGuard, JwtService],
})
export class UserModule {}
