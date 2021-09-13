import { UserEnum } from 'src/enums/user-role.enum';

export interface UserInterface {
  id: number;
  fullName: string;
  email: string;
  password?: string;
  idNumber?: string;
  phoneNumber: string;
  hash?: string;
  isDeleted?: boolean;
  role?: UserEnum;
}
