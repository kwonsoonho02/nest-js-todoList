import { User } from 'src/entities/users.entities';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDTO, UpdateUserDTO } from 'src/dto/users.dto';
import { HttpException } from '@nestjs/common/exceptions';
import { HttpStatus } from '@nestjs/common/enums';
import { hash } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(@InjectModel(User) private userModel: typeof User) {}

  async findUser(userData: CreateUserDTO): Promise<User> {
    const user = await this.userModel.findOne({
      where: { email: userData.email },
    });
    return user;
  }

  async updateUser(userId: number, userData: UpdateUserDTO): Promise<number> {
    const findUserId = await this.userModel.findByPk(userId);
    if (!findUserId) throw new HttpException('유저 없음', HttpStatus.NOT_FOUND);

    const hashedPassword = await hash(userData.password, 10);
    const [affectCount] = await this.userModel.update(
      { ...userData, password: hashedPassword },
      { where: { userId } },
    );
    return affectCount;
  }

  async deleteUser(userId: number): Promise<number> {
    const findUserId = await this.userModel.findByPk(userId);
    if (!findUserId) throw new HttpException('유저 없음', HttpStatus.NOT_FOUND);

    return await this.userModel.destroy({ where: { userId } });
  }
}
