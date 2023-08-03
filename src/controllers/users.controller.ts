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
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAllUserList(
    @Req() req: Request,
    @Res() res: Response,
    @Body() userData,
  ) {
    try {
      const findUserId: User[] = await this.userService.findUser(userData);

      res.status(200).json({ data: findUserId, msg: 'findAll' });
    } catch (error) {
      return console.log(error);
    }
  }

  @Post()
  async createUser(
    @Req() req: Request,
    @Res() res: Response,
    @Body() userData,
  ) {
    try {
      const createUser: User = await this.userService.createUser(userData);

      res.status(201).json({ data: createUser, msg: 'create' });
    } catch (error) {
      return console.log(error);
    }
  }

  @Put(':id')
  async updateUser(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id: number,
    @Body() userData,
  ) {
    try {
      const updateUser: number = await this.userService.updateUser(
        id,
        userData,
      );
      res.status(200).json({ data: updateUser, msg: 'update' });
    } catch (error) {}
  }

  @Delete(':id')
  async deleteUser(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id: number,
  ) {
    try {
      const deleteUser: number = await this.userService.deleteUser(id);
      res.status(200).json({ data: deleteUser, msg: 'delete' });
    } catch (error) {}
  }
}
