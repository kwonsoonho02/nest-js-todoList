import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthController } from 'src/controllers/auth.controller';
import { User } from 'src/entities/users.entities';
import { AuthService } from 'src/services/auth.services';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from 'src/guard/auth.guard';
import { RefreshGuard } from 'src/guard/refresh.gaurd';

@Module({
  imports: [
    SequelizeModule.forFeature([User]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        // secret: await constant.JWTConfigService(),
        global: true,
        secret: configService.get<string>('accessToken'),
        signOptions: { expiresIn: '5m' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard, RefreshGuard],
  exports: [AuthGuard, AuthService, RefreshGuard],
})
export class AuthModule {}
