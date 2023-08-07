import {
  Controller,
  Delete,
  Get,
  Next,
  Post,
  Put,
  Req,
  Res,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { User } from 'src/entities/users.entities';
import { UserService } from 'src/services/users.services';
import { Request, Response } from 'express';
import { AuthGuard } from 'src/guard/auth.guard';
import { CreateUserDTO, UpdateUserDTO } from 'src/dto/users.dto';
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAllUserList(@Req() req: Request, @Res() res: Response) {
    try {
      const findUserId: User[] = await this.userService.findUser();

      res.status(200).json({ data: findUserId, msg: 'findAll' });
    } catch (error) {
      return console.log(error);
    }
  }

  @Post()
  async createUser(
    @Req() req: Request,
    @Res() res: Response,
    @Body() userData: CreateUserDTO,
  ) {
    try {
      const createUser: User = await this.userService.createUser(userData);

      res.status(201).json({ data: createUser, msg: 'create' });
    } catch (error) {
      return console.log(error);
    }
  }

  @UseGuards(AuthGuard)
  @Put()
  async updateUser(
    @Req() req: Request,
    @Res() res: Response,
    @Body() userData: UpdateUserDTO,
  ) {
    try {
      const userId: number = req['user'].id;
      const updateUser: number = await this.userService.updateUser(
        userId,
        userData,
      );
      res.status(200).json({ data: updateUser, msg: 'update' });
    } catch (error) {}
  }

  @UseGuards(AuthGuard)
  @Delete()
  async deleteUser(@Req() req: Request, @Res() res: Response) {
    try {
      const userId: number = req['user'].id;
      const deleteUser: number = await this.userService.deleteUser(userId);
      res.status(200).json({ data: deleteUser, msg: 'delete' });
    } catch (error) {}
  }
}
