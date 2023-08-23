import {
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Req,
  Res,
  Body,
  UseGuards,
  UseFilters,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { User } from 'src/entities/users.entities';
import { UserService } from 'src/services/users.services';
import { Request } from 'express';
import { AuthGuard } from 'src/guard/auth.guard';
import { CreateUserDTO, UpdateUserDTO } from 'src/dto/users.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { HttpExceptionFilter } from 'src/filter/httpExceptionFilter';

@UseFilters(HttpExceptionFilter)
@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Get all users' })
  @Get()
  async findAllUserList(@Body() userData: CreateUserDTO) {
    const findUsers: User = await this.userService.findUser(userData);

    if (!findUsers) {
      throw new HttpException(
        'Failed to find users',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return findUsers;
  }

  @ApiOperation({ summary: 'Update user' })
  @UseGuards(AuthGuard)
  @Put()
  async updateUser(@Req() req: Request, @Body() userData: UpdateUserDTO) {
    const userId: number = req['user'].id;
    const updateUser: number = await this.userService.updateUser(
      userId,
      userData,
    );
    if (!updateUser) {
      throw new HttpException(
        'Failed to update user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return updateUser;
  }

  @ApiOperation({ summary: 'Delete user' })
  @UseGuards(AuthGuard)
  @Delete()
  async deleteUser(@Req() req: Request) {
    const userId: number = req['user'].id;
    const deleteUser: number = await this.userService.deleteUser(userId);

    if (!deleteUser) {
      throw new HttpException(
        'Failed to delete user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return deleteUser;
  }
}
