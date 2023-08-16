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
import { RefreshGuard } from 'src/guard/refresh.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'User signup' })
  @Post('/signup')
  async signUp(@Body() userData: CreateUserDTO, @Res() res: Response) {
    try {
      const signUp: User = await this.authService.signUp(userData);

      res.status(200).json({ data: signUp, msg: 'create' });
    } catch (error) {
      console.log(error);
    }
  }

  @ApiOperation({ summary: 'User signin' })
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
      const getRefreshTokenDB: User = await this.authService.initRefreshTokenDB(
        userSignIn,
      );
      const getRefreshTokenExp = await this.authService.initRefreshTokenDBExp(
        userSignIn,
      );
      const refreshTokenDB = getRefreshTokenDB.currentRefreshToken;
      const refreshTokenExp = getRefreshTokenExp.currentRefreshTokenExp;

      res.cookie('accessToken', accessToken, { httpOnly: true });
      res.cookie('refreshToken', refreshToken, { httpOnly: true });

      res.status(200).json({
        accessToken: accessToken,
        refreshToken: refreshToken,
        refreshTokenDB: refreshTokenDB,
        refreshTokenExp: refreshTokenExp,
        msg: 'signin',
      });
    } catch (error) {
      console.log(error);
    }
  }

  @ApiOperation({ summary: 'User signout' })
  @UseGuards(AuthGuard)
  @Post('/signout')
  async signOut(@Res() res: Response, @Req() req: Request) {
    try {
      const userId: number = req['user'].id;
      const deleteToken: User = await this.authService.signOut(userId);
      const clearDBRefreshToken = await this.authService.clearDBRefreshToken(
        userId,
      );
      res.clearCookie('authorization');
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');
      res.status(200).json({
        data: deleteToken,
        clear: clearDBRefreshToken,
        message: 'logout',
      });
    } catch (error) {}
  }

  @ApiOperation({ summary: 'Refresh token' })
  @UseGuards(RefreshGuard)
  @Post('/refresh')
  async refresh() {
    try {
    } catch (err) {
      throw new UnauthorizedException();
    }
  }
}
