import { ExecutionContext } from '@nestjs/common';
import { CanActivate } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserEnum } from 'src/enums/user-role.enum';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRole = this.reflector.getAllAndOverride<UserEnum>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (requiredRole === UserEnum.Customer) {
      return true;
    }
    if (!requiredRole) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();

    return requiredRole === user.role;
  }
}
