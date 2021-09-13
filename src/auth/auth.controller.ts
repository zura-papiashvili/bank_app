import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { LoginDto } from 'src/dto/login.dto';
import { UsersService } from 'src/modules/users/users.service';
import {
  getErrorMessage,
  getSuccessMessage,
} from 'src/utils/response-functions.utils';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('/login')
  @UsePipes(ValidationPipe)
  async login(@Body() data: LoginDto) {
    try {
      const foundUser = await this.userService.findUserByEmailAndPassword(data);
      if(!foundUser){
        return getErrorMessage('Something Went Wrong! User/Password Is Not Correct!');
      }else {
        const jwtToken = await this.authService.login(foundUser);
        const user = {
          email: foundUser.email,
          fullName: foundUser.fullName,
          jwtToken,
        };
        return getSuccessMessage(user);
      } 
    } catch (err) {
      return getErrorMessage('Something Went Wrong! User Could Not Exist!');
    }
  }
}
