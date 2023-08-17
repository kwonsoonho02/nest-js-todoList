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
} from '@nestjs/common';
import { User } from 'src/entities/users.entities';
import { UserService } from 'src/services/users.services';
import { Request, Response } from 'express';
import { AuthGuard } from 'src/guard/auth.guard';
import { CreateUserDTO, UpdateUserDTO } from 'src/dto/users.dto';
import { RefreshGuard } from 'src/guard/refresh.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Get all users' })
  @Get()
  async findAllUserList() {
    try {
      const findUsers: User[] = await this.userService.findUser();

      return findUsers;
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'Update user' })
  @UseGuards(AuthGuard)
  @Put()
  async updateUser(@Req() req: Request, @Body() userData: UpdateUserDTO) {
    try {
      const userId: number = req['user'].id;
      const updateUser: number = await this.userService.updateUser(
        userId,
        userData,
      );
      return updateUser;
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'Delete user' })
  @UseGuards(AuthGuard, RefreshGuard)
  @Delete()
  async deleteUser(@Req() req: Request, @Res() res: Response) {
    try {
      const userId: number = req['user'].id;
      const deleteUser: number = await this.userService.deleteUser(userId);
      return deleteUser;
    } catch (error) {
      throw error;
    }
  }
}
