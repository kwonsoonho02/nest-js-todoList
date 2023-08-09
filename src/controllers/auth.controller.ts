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
import { AuthService } from 'src/services/auth.services';
import { Request, Response } from 'express';
import { CreateUserDTO } from 'src/dto/users.dto';
import { User } from 'src/entities/users.entities';
import { AuthGuard } from 'src/guard/auth.guard';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async signUp(@Body() userData: CreateUserDTO, @Res() res: Response) {
    try {
      const signUp: User = await this.authService.signUp(userData);

      res.status(200).json({ data: signUp, msg: 'create' });
    } catch (error) {
      console.log(error);
    }
  }

  @Post('/signin')
  async signIn(
    @Req() req: Request,
    @Res() res: Response,
    @Body() userData: CreateUserDTO,
  ) {
    try {
      const userSignIn: User = await this.authService.signIn(userData);
      const refreshTokenDB: User = await this.authService.initRefreshTokenDB(
        userSignIn,
      );
      const accessToken: string = await this.authService.generateAccessToken(
        userSignIn,
      );
      const refreshToken = refreshTokenDB.currentRefreshToken;

      res.cookie('accessToken', accessToken, { httpOnly: true });
      res.cookie('refreshToken', refreshToken, { httpOnly: true });

      res.status(200).json({
        accessToken: accessToken,
        refreshToken: refreshToken,
        msg: 'login success',
      });
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  }

  @UseGuards(AuthGuard)
  @Post('/signout')
  async signOut(@Res() res: Response, @Req() req: Request) {
    try {
      const userId: number = req['user'].id;
      const deleteToken = await this.authService.signOut(userId);
      res.clearCookie('authorization');
      res.status(200).json({ data: deleteToken, message: 'logout' });
    } catch (error) {}
  }
}
