import {
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { compare, hash } from 'bcrypt';
import { CreateUserDTO } from 'src/dto/users.dto';
import { User } from 'src/entities/users.entities';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

interface Payload {
  id: number;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User) private userModel: typeof User,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signUp(userData: CreateUserDTO): Promise<User> {
    const userFind = this.userModel.findOne({
      where: { email: userData.email },
    });
    if (!userFind)
      throw new HttpException('이메일 있슴당당구리~', HttpStatus.CONFLICT);

    const hashedPassword = await hash(userData.password, 10);
    const createUser: User = await this.userModel.create({
      ...userData,
      password: hashedPassword,
    });

    return createUser;
  }

  async signIn(userData: CreateUserDTO) {
    const userFind: User = await this.userModel.findOne({
      where: { email: userData.email },
    });
    const passwordCheck: boolean = await compare(
      userData.password,
      userFind.password,
    );

    if (!userFind || !passwordCheck) throw new UnauthorizedException();

    return userFind;
  }
  async generateAccessToken(userId: number): Promise<string> {
    const payload: Payload = {
      id: userId,
    };
    return this.jwtService.signAsync(payload);
  }

  async generateRefreshToken(userSignIn: User): Promise<string> {
    const payload: Payload = {
      id: userSignIn.userId,
    };

    const refreshToken = await this.jwtService.signAsync(
      { id: payload.id },
      {
        secret: this.configService.get<string>('refreshToken'),
        expiresIn: this.configService.get<string>('refreshTokenTime'),
      },
    );

    return refreshToken;
  }

  async initRefreshTokenDBExp(userSignIn): Promise<User> {
    const currentDate = new Date();

    const currentRefreshTokenExp = new Date(
      currentDate.getTime() +
        parseInt(this.configService.get<string>('refreshTokenTime')),
    );

    userSignIn.currentRefreshTokenExp = currentRefreshTokenExp;
    return await userSignIn.save();
  }

  async getUserIfRefreshTokenMatches(
    refreshToken,
    refreshId,
  ): Promise<boolean> {
    const userRefreshToken: User = await this.userModel.findOne({
      where: { userId: refreshId },
    });

    const isRefreshTokenMatching: boolean = await compare(
      refreshToken,
      userRefreshToken.currentRefreshToken,
    );

    if (!isRefreshTokenMatching)
      throw new UnauthorizedException('히힝 토큰 없지롱롱구리');

    console.log('refresh token possession');
    return true;
  }

  async clearDBRefreshToken(userId: number): Promise<User> {
    const userFind: User = await this.userModel.findByPk(userId);

    userFind.currentRefreshToken = null;

    return await userFind.save();
  }
}
