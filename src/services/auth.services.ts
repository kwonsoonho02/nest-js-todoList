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
    console.log(userData.email);
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
  async generateAccessToken(userSignIn: User): Promise<string> {
    const payload: Payload = {
      id: userSignIn.id,
    };
    return this.jwtService.signAsync(payload);
  }

  async generateRefreshToken(userSignIn: User): Promise<string> {
    const payload: Payload = {
      id: userSignIn.id,
    };
    return this.jwtService.signAsync(
      { id: payload.id },
      {
        secret: this.configService.get<string>('refreshToken'),
        expiresIn: '24h',
      },
    );
  }

  async initRefreshTokenDB(userData) {
    const userFind: User = await this.userModel.findOne({
      where: { email: userData.email },
    });

    const refreshToken = await this.generateRefreshToken(userFind);
    userFind.currentRefreshToken = refreshToken;
    return await userFind.save();
  }

  async signOut(userId: number) {
    const userFind: User = await this.userModel.findByPk(userId);
    if (!userFind)
      throw new HttpException('해당 유저가 아닙니당당구리~', HttpStatus.FOUND);

    return userFind;
  }
}
