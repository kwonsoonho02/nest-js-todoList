import { Injectable } from '@nestjs/common/decorators';
import { UnauthorizedException } from '@nestjs/common/exceptions';
import { CanActivate, ExecutionContext } from '@nestjs/common/interfaces';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/services/auth.services';

@Injectable()
export class RefreshGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    const refreshToken = req.cookies.refreshToken;

    try {
      console.log(refreshToken);
      const refreshTokenPayload = await this.jwtService.verifyAsync(
        refreshToken,
        {
          secret: this.configService.get('refreshToken'),
        },
      );
      const refreshId = refreshTokenPayload.id;
      console.log('리프래쉬 토큰 아이디 확인 : ', refreshId);
      await this.authService.getUserIfRefreshTokenMatches(
        refreshToken,
        refreshId,
      );
      console.log('리프래쉬 토큰 확인 완료');
      const newAccessToken = this.jwtService.sign({
        sub: refreshId,
        secret: this.configService.get('accessToken'),
      });
      res.cookie('accessToken', newAccessToken, { httpOnly: true });
      res.status(200).json({
        accessToken: newAccessToken,
        msg: '엑세스 토큰 재 발급 완료',
      });
    } catch (error) {
      console.error('RefreshGuard Error:', error.message);
      throw new UnauthorizedException('Unauthorized');
    }
    return true;
  }
}
