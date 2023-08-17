import {
  Controller,
  Post,
  Req,
  Res,
  Body,
  UseGuards,
  UnauthorizedException,
  Header,
} from '@nestjs/common';
import { AuthService } from 'src/services/auth.services';
import { Request, Response } from 'express';
import { CreateUserDTO } from 'src/dto/users.dto';
import { User } from 'src/entities/users.entities';
import { AuthGuard } from 'src/guard/auth.guard';
import { RefreshGuard } from 'src/guard/refresh.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { hash } from 'bcrypt';
import { Console } from 'console';

@ApiTags('auth')
@Controller()
export class AuthController {
  configService: any;
  jwtService: any;
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'User signup' })
  @Post('/signup')
  async signUp(@Body() userData: CreateUserDTO) {
    try {
      const signUp: User = await this.authService.signUp(userData);

      return signUp;
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'User signin' })
  @Post('/signin')
  async signIn(@Res() res: Response, @Body() userData: CreateUserDTO) {
    try {
      const userSignIn: User = await this.authService.signIn(userData);

      const accessToken: string = await this.authService.generateAccessToken(
        userSignIn.userId,
      );
      const refreshToken = await this.authService.generateRefreshToken(
        userSignIn,
      );

      const getRefreshTokenExp = await this.authService.initRefreshTokenDBExp(
        userSignIn,
      );

      const hashedRefreshToken = await hash(refreshToken, 10);
      userSignIn.currentRefreshToken = hashedRefreshToken;

      const initRefreshTokenDB = await userSignIn.save();

      const refreshTokenExp = getRefreshTokenExp.currentRefreshTokenExp;

      res.cookie('accessToken', accessToken, { httpOnly: true });
      res.cookie('refreshToken', refreshToken, { httpOnly: true });

      const responsePayload = {
        accessToken,
        refreshToken,
        currentRefreshToken: initRefreshTokenDB.currentRefreshToken,
        currentRefreshTokenExp: refreshTokenExp,
        msg: 'sign in',
      };

      return res.status(200).json(responsePayload);
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'User sign out' })
  @UseGuards(AuthGuard)
  @Post('/signout')
  async signOut(@Res() res: Response, @Req() req: Request) {
    try {
      const userId: number = req['user'].id;
      const clearDBRefreshToken = await this.authService.clearDBRefreshToken(
        userId,
      );

      res.clearCookie('authorization');
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');

      const responsePayload = {
        clearDBRefreshToken,
        msg: 'sign out',
      };

      return res.status(200).json(responsePayload);
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'Refresh token' })
  @UseGuards(RefreshGuard)
  @Post('/refresh')
  async refresh(@Req() req: Request) {
    try {
      const refreshId = req['refreshId'];
      console.log(refreshId);
      const accessToken = await this.authService.generateAccessToken(refreshId);

      return accessToken;
    } catch (err) {
      throw new UnauthorizedException();
    }
  }
}
