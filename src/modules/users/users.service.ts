import { Injectable } from '@nestjs/common';
import { GetAllUsersDto } from 'src/dto/get-all-users.dto';
import { LoginDto } from 'src/dto/login.dto';
import { RegisterUserDto } from 'src/dto/register-user.dto';
import { UpdateUserDto } from 'src/dto/update-user.dto';
import { UsersRepoService } from 'src/repositories/users-repo/users.repository';

@Injectable()
export class UsersService {
    constructor(
    private readonly userRepository: UsersRepoService
    ){}

    async register(data: RegisterUserDto){
        return await this.userRepository.register(data);
    }

    async findUserByEmailAndPassword(data: LoginDto){
        return await this.userRepository.findUSerByEmailAndPassword(data.email, data.password);
    }

    async getAllUsers(data: GetAllUsersDto){
        return await this.userRepository.getAllUsers(data);
    }

    async getUser(id: number){
        return await this.userRepository.getUser(id);
    }

    async updateUser(id: number, data: UpdateUserDto){
        return await this.userRepository.updateUser(id, data);
    }

    async deleteUser(id: number){
        return await this.userRepository.deleteUser(id);
    }
    
}
