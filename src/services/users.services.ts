import { User } from 'src/entities/users.entities';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDTO } from 'src/dto/users.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User) private userModel: typeof User) {}

  async findAllUserList(): Promise<User[]> {
    return await this.userModel.findAll();
  }
  async createUser(userData: CreateUserDTO): Promise<User> {
    return await this.userModel.create({ ...userData });
  }

  async updateUser(id: string, userData: CreateUserDTO): Promise<number> {
    const [affectCount] = await this.userModel.update(
      { ...userData },
      { where: { id } },
    );
    return affectCount;
  }

  async deleteUser(id: number) {
    return await this.userModel.destroy({ where: { id } });
  }
}
