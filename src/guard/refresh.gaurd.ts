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
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;
    console.log(refreshToken);
    try {
      console.log('토큰 확인 : ', accessToken);
      const accessTokenCheck = await this.jwtService.verifyAsync(accessToken, {
        secret: this.configService.get('accessToken'),
      });
      console.log('토큰 체크 : ', accessTokenCheck);
      if (!accessTokenCheck) {
        const refreshTokenPayload = await this.jwtService.verifyAsync(
          refreshToken,
          {
            secret: this.configService.get('refreshToken'),
          },
        );
        const refreshId = refreshTokenPayload.id;
        console.log(refreshId);
        const refreshTokenCheck: boolean =
          await this.authService.getUserIfRefreshTokenMatches(
            refreshToken,
            refreshId,
          );

        const newAccessToken = this.jwtService.sign({
          sub: refreshId,
          secret: this.configService.get('accessToken'),
        });
        res.cookie('accessToken', newAccessToken, { httpOnly: true });
        return true;
      }

      return true;
    } catch (error) {
      console.error('RefreshGuard Error:', error.message);
      throw new UnauthorizedException('Unauthorized');
    }
  }
}
