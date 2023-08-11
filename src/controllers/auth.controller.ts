import {
  Controller,
  Post,
  Req,
  Res,
  Body,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from 'src/services/auth.services';
import { Request, Response } from 'express';
import { CreateUserDTO } from 'src/dto/users.dto';
import { User } from 'src/entities/users.entities';
import { AuthGuard } from 'src/guard/auth.guard';
import { RefreshGuard } from 'src/guard/refresh.gaurd';

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

      const accessToken: string = await this.authService.generateAccessToken(
        userSignIn,
      );
      const refreshToken = await this.authService.generateRefreshToken(
        userSignIn,
      );
      const refreshTokenDB: User = await this.authService.initRefreshTokenDB(
        userSignIn,
      );
      await this.authService.getCurrentRefreshTokenExp(userSignIn);

      refreshTokenDB.currentRefreshToken;

      console.log(
        '해쉬 후 리플래쉬 토큰 : ',
        refreshTokenDB.currentRefreshToken,
      );

      res.cookie('accessToken', accessToken, { httpOnly: true });
      res.cookie('refreshToken', refreshToken, { httpOnly: true });

      res.status(200).json({
        accessToken: accessToken,
        refreshToken: refreshToken,
        msg: 'login success',
      });
    } catch (error) {
      console.log(error);
    }
  }
  generateRefreshToken(userSignIn: User) {
    throw new Error('Method not implemented.');
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

  @UseGuards(RefreshGuard)
  @Post('/refresh')
  async refresh() {
    try {
    } catch (err) {
      throw new UnauthorizedException();
    }
  }
}
