import { ConfigService } from '@nestjs/config';

export const jwtConstants = {
  secret: null, // 기본값으로 설정

  async onApplicationBootstrap() {
    const configService = new ConfigService();
    jwtConstants.secret = configService.get<string>('JWT_SECRET_KEY');
  },
};
