import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserInterface } from 'src/interface/user.interface';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    // private usersService: UsersService,
    ) {}
  async login(user: UserInterface) {
    //   Entity or Interface??
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      sub: user.id,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
