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
} from '@nestjs/common';
import { AuthService } from 'src/services/auth.services';
import { Request, Response } from 'express';
import { CreateUserDTO } from 'src/dto/users.dto';
import { User } from 'src/entities/users.entities';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async signUp(@Body() userData: CreateUserDTO, @Res() res: Response) {
    try {
      const signUp: User = await this.authService.signUp(userData);

      res.status(200).json({ data: signUp, msg: 'create' });
      res;
    } catch (error) {
      console.log(error);
    }
  }

  @Post('/signin')
  async signIn(@Res() res: Response, @Body() userData: CreateUserDTO) {
    try {
      const userSignIn = await this.authService.signIn(userData);

      res.setHeader('Authorization', 'Bearer ' + userSignIn.accessToken);

      return res.json({ data: userSignIn, msg: 'signin', userSignIn });
    } catch (error) {
      console.log(error);
    }
  }

  @Post()
  async signOut() {}
}
