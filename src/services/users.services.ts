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

  async findUser(): Promise<User[]> {
    const user = await this.userModel.findAll();

    // const user = await this.userModel.findAll({
    //   where: { id: userData.id },
    // });
    return user;
  }
  async createUser(userData: CreateUserDTO): Promise<User> {
    const findEmail = await this.userModel.findOne({
      where: { email: userData.email },
    });
    if (findEmail)
      throw new HttpException('이메일 있슴당당구리~', HttpStatus.CONFLICT);

    const hashedPassword = await hash(userData.password, 10);
    return await this.userModel.create({
      ...userData,
      password: hashedPassword,
    });
  }

  async updateUser(userId: number, userData: UpdateUserDTO): Promise<number> {
    const findUser = await this.userModel.findByPk(userId);
    if (!findUser) throw new HttpException('유저 없음', HttpStatus.NOT_FOUND);

    const hashedPassword = await hash(userData.password, 10);
    const [affectCount] = await this.userModel.update(
      { ...userData, password: hashedPassword },
      { where: { id: userId } },
    );
    return affectCount;
  }

  async deleteUser(userId: number): Promise<number> {
    const findUser = await this.userModel.findByPk(userId);
    if (!findUser) throw new HttpException('유저 없음', HttpStatus.NOT_FOUND);

    return await this.userModel.destroy({ where: { id: userId } });
  }
}
