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

interface Payload {
  id: number;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User) private userModel: typeof User,
    private jwtService: JwtService,
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

  async signIn(userData: CreateUserDTO): Promise<{ accessToken: string }> {
    const userFind: User = await this.userModel.findOne({
      where: { email: userData.email },
    });
    const passwordCheck: boolean = await compare(
      userData.password,
      userFind.password,
    );

    if (!userFind || !passwordCheck) throw new UnauthorizedException();

    const payload: Payload = { id: userFind.id };

    const accessToken = await this.jwtService.signAsync(payload);
    return {
      accessToken,
    };
  }

  async signOut(userData: CreateUserDTO) {
    const userFind = await this.userModel.findOne({
      where: { email: userData.email, password: userData.password },
    });

    if (!userFind)
      throw new HttpException('유저 없어용용구리~', HttpStatus.FOUND);

    return userFind;
  }
}
