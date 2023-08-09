import { Injectable } from '@nestjs/common/decorators';
import { UnauthorizedException } from '@nestjs/common/exceptions';
import { CanActivate, ExecutionContext } from '@nestjs/common/interfaces';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RefreshGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    try {
      const accessTokenCheck = await this.jwtService.verifyAsync(accessToken, {
        secret: this.configService.get('accessToken'),
      });

      if (!accessTokenCheck) {
        const refreshTokenPayload = await this.jwtService.verifyAsync(
          refreshToken,
          {
            secret: this.configService.get('refreshToken'),
          },
        );

        const newAccessToken = this.jwtService.sign({
          sub: refreshTokenPayload.sub,
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
