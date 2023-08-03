import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthController } from 'src/controllers/auth.controller';
import { User } from 'src/entities/users.entities';
import { AuthService } from 'src/services/auth.services';
import { JwtModule } from '@nestjs/jwt';
import { TodoModule } from './todos.module';
import { UserModule } from './users.module';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { jwtConstants } from 'src/confing/jwtConstants';

@Module({
  imports: [
    SequelizeModule.forFeature([User]),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      useFactory: async () => ({
        secret: jwtConstants.secret,
        signOptions: { expiresIn: '60s' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
