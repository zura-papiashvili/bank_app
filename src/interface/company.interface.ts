import { UserEntity } from 'src/entities/user.entity';

export interface CompanyInterface {
  id?: number;
  companyName: string;
  email: string;
  user: number | UserEntity;
  isDeleted?: boolean;
}
