import { UserEntity } from 'src/entities/user.entity';
import { UserInterface } from './user.interface';

export interface Account {
  id: number;
  user?: number | UserInterface;
  cardNumber: string;
  balance?: number;
  accountNumber: string;
  isDeleted?: boolean;
}

export function createAccountInterface(data) {
  const account = {
    id: data.id,
    user: data.user,
    cardNumber: '****' + data.cardNumber.slice(-4),
    balance: data.balance,
    accountNumber: data.accountNumber,
  };
  return account;
}
