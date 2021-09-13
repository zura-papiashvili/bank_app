import { SetMetadata } from '@nestjs/common';
import { UserEnum } from 'src/enums/user-role.enum';

export const ROLES_KEY = 'roles';
export const Roles = (roles: UserEnum) => SetMetadata(ROLES_KEY, roles);