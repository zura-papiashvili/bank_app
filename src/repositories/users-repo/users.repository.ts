import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterUserDto } from 'src/dto/register-user.dto';
import { UpdateUserDto } from 'src/dto/update-user.dto';
import { UserEntity } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { GetAllUsersDto } from 'src/dto/get-all-users.dto';
import { UserInterface } from 'src/interface/user.interface';

@Injectable()
export class UsersRepoService {
  private readonly logger = new Logger(UsersRepoService.name);
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async register(data: RegisterUserDto): Promise<UserInterface> {
    try {
      const newUser = new UserEntity();
      newUser.fullName = data.fullName;
      newUser.email = data.email;
      newUser.idNumber = data.idNumber;
      newUser.phoneNumber = data.phoneNumber;
      newUser.role = data.role;

      const salt = await bcrypt.genSalt();
      newUser.hash = await bcrypt.hash(data.password, salt);
      this.userRepository.save(newUser);
      this.logger.log(`Register New User ${newUser}`);

      return {
        id: newUser.id,
        fullName: newUser.fullName,
        idNumber: newUser.idNumber,
        email: newUser.email,
        role: newUser.role,
        phoneNumber: newUser.phoneNumber,
        hash: newUser.hash,
      };
    } catch (err) {
      this.logger.log(`Could Not Create New User`);
      return null;
    }
  }

  async findUSerByEmailAndPassword(
    email: string,
    password: string,
  ): Promise<UserInterface> {
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });
    this.logger.log(`Find User ${user}`);
    if (!user) {
      return null;
    }

    const corectPassword = await bcrypt.compare(password, user.hash);
    if (corectPassword) {
      return user;
    } else {
      return null;
    }
  }

  async getAllUsers(query: GetAllUsersDto): Promise<UserInterface[]> {
    try {
      const queryBuilder = this.userRepository.createQueryBuilder();
      queryBuilder.where('isDeleted = false');
      const limit = Math.min(query.limit, 20);

      if (query.limit) {
        queryBuilder.limit(limit);
      } else {
        queryBuilder.limit(25);
      }

      if (query.page) {
        const page = query.page - 1;
        queryBuilder.offset(page * limit);
      }

      const res = await queryBuilder.getMany();

      const user = res.map((user) => ({
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
      }));
      this.logger.log(`Get All Users ${user}`);
      return user;
    } catch (err) {
      this.logger.log(`Could Not Find Users`);
    }
  }

  async getUser(id: number): Promise<UserInterface> {
    const result = await this.userRepository.findOne(id);
    this.logger.log(`Get User By Id Number ${result}`);
    return result;
  }

  async updateUser(id: number, data: UpdateUserDto): Promise<UserInterface> {
    try {
      await this.userRepository.update(id, data);
      const result = await this.userRepository.findOne(id);
      this.logger.log(`Update User ${result}`);
      return result;
    } catch (err) {
      this.logger.log(`Could Not Update User`);
    }
  }

  async deleteUser(id: number): Promise<string> {
    try {
      await this.userRepository.save({
        id,
        isDeleted: true,
      });
      this.logger.log(`Delete User`);
      return 'User was Deleted !';
    } catch (err) {
      this.logger.log(`Could Not Delete User!`);
      return null;
    }
  }
}
