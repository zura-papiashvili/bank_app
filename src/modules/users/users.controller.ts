import { Logger, Req } from '@nestjs/common';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from 'src/auth/auth.service';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { GetAllUsersDto } from 'src/dto/get-all-users.dto';
import { RegisterUserDto } from 'src/dto/register-user.dto';
import { UpdateUserDto } from 'src/dto/update-user.dto';
import { UserEnum } from 'src/enums/user-role.enum';
import {
  getErrorMessage,
  getSuccessMessage,
} from 'src/utils/response-functions.utils';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);
  constructor(private readonly userService: UsersService) {}

  @Post()
  @UsePipes(ValidationPipe)
  @Roles(UserEnum.Operator)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async register(@Body() data: RegisterUserDto) {
    try {
      const newUser = await this.userService.register(data);
      this.logger.log(`Register User ${newUser}`);
      return getSuccessMessage(newUser);
    } catch (err) {
      return getErrorMessage('User Could Not Register !');
    }
  }

  @Get(':id')
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async getUser(@Param('id') id: number, @Req() req) {
    try {
      if (req.user.userId !== Number(id)) {
        return getErrorMessage('Access is denied');
      }
      const res = await this.userService.getUser(id);
      this.logger.log(`Get User By Id Number ${res}`);
      return getSuccessMessage(res);
    } catch (err) {
      return getErrorMessage('Could Not Find User with this id!');
    }
  }

  @Get()
  @UsePipes(ValidationPipe)
  @Roles(UserEnum.Operator)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async getAllUsers(@Query() data: GetAllUsersDto) {
    try {
      const user = await this.userService.getAllUsers(data);
      this.logger.log(`Get All Users ${user}`);
      return getSuccessMessage(user);
    } catch (err) {
      return getErrorMessage('Could Not Find Users!');
    }
  }

  @Patch(':id')
  @UsePipes(ValidationPipe)
  @Roles(UserEnum.Operator)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async updateUser(@Param('id') id: number, @Body() data: UpdateUserDto) {
    try {
      const result = await this.userService.updateUser(id, data);
      this.logger.log(`Update User ${result}`);
      return getSuccessMessage(result);
    } catch (err) {
      return getErrorMessage('Could Not Update Information !');
    }
  }

  @Delete(':id')
  @UsePipes(ValidationPipe)
  @Roles(UserEnum.Operator)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async deleteUser(@Param('id') id: number) {
    try {
      const res = await this.userService.deleteUser(Number(id));
      this.logger.log(`Delete User ${res}`);
      return getSuccessMessage(res);
    } catch (err) {
      return getErrorMessage('Could Not Delete User !');
    }
  }
}
