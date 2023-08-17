import { Injectable, Next } from '@nestjs/common/decorators';
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
    const refreshToken = req.cookies.refreshToken;

    try {
      const refreshTokenPayload = await this.jwtService.verifyAsync(
        refreshToken,
        {
          secret: this.configService.get('refreshToken'),
        },
      );
      const refreshId = refreshTokenPayload.id;
      await this.authService.getUserIfRefreshTokenMatches(
        refreshToken,
        refreshId,
      );
      req['refreshId'] = refreshId;
    } catch (error) {
      console.error('RefreshGuard Error:', error.message);
      throw new UnauthorizedException('Unauthorized');
    }
    return true;
  }
}
