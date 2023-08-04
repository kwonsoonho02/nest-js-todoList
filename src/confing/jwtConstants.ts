import { Injectable } from '@nestjs/common/decorators';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtConstants {
  constructor(private readonly configService: ConfigService) {}

  async JWTConfigService(): Promise<string> {
    return this.configService.get<string>('JWT_SECRET_KEY');
  }
}
