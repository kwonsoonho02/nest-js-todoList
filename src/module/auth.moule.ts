import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthController } from 'src/controllers/auth.controller';
import { User } from 'src/entities/users.entities';
import { AuthService } from 'src/services/auth.services';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    SequelizeModule.forFeature([User]),
    JwtModule.register({
      secret: 'SECRET',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, SequelizeModule],
})
export class AuthModeul {}
