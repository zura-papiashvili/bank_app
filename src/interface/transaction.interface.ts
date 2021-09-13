import { AccountEntity } from 'src/entities/account.entity';
import { TransactionStatus } from 'src/enums/transaction-status.enum';
import { TransactionType } from 'src/enums/transaction-type.enum';
import { Account } from './account.interface';

export interface Transaction {
  id: number;
  time: Date;
  amount: number;
  receiverAccountId?: number | Account;
  senderAccountId?: number | Account;
  type: TransactionType;
  status: TransactionStatus;
}

export function createTransactionInterface(data): Transaction {
  const transaction = {
    id: data.id,
    time: data.time,
    amount: data.amount,
    receiverAccountId: data.receiverAccount,
    senderAccountId: data.senderAccount,
    type: data.type,
    status: data.status,
  };
  if (transaction.type === TransactionType.Deposit) {
    delete transaction.senderAccountId;
  } else if (transaction.type === TransactionType.Withdraw) {
    delete transaction.receiverAccountId;
  }
  return transaction;
}
export function createTransactionByIdInterface(foundTransaction): Transaction {
  const transaction = {
    id: foundTransaction.transaction_id,
    time: foundTransaction.transaction_time,
    amount: foundTransaction.transaction_amount,
    type: foundTransaction.transaction_type,
    status: foundTransaction.transaction_status,
    receiverAccountId: foundTransaction.transaction_receiverAccountId,
    senderAccountId: foundTransaction.transaction_senderAccountId,
  };
  return transaction;
}
export function createPendingTransactionInterface(transaction): Transaction {
  const result = {
    id: transaction.transaction_id,
    time: transaction.transaction_time,
    amount: transaction.transaction_amount,
    status: transaction.transaction_status,
    type: transaction.transaction_type,
    receiverAccountId: {
      id: transaction.transaction_receiverAccountId,
      balance: transaction.receiverAccounts_balance,
      accountNumber: transaction.receiverAccounts_accountNumber,
      isDeleted: transaction.receiverAccounts_isDeleted,
      cardNumber: transaction.receiverAccounts_cardNumber,
      user: {
        id: transaction.receiver_id,
        fullName: transaction.receiver_fullName,
        email: transaction.receiver_email,
        idNumber: transaction.receiver_idNumber,
        phoneNumber: transaction.receiver_phoneNumber,
        isDeleted: transaction.receiver_isDeleted,
        role: transaction.receiver_role,
      },
    },
    senderAccountId: {
      id: transaction.transaction_senderAccountId,
      balance: transaction.senderAccounts_balance,
      accountNumber: transaction.senderAccounts_accountNumber,
      isDeleted: transaction.senderAccounts_isDeleted,
      cardNumber: transaction.senderAccounts_cardNumber,
      user: {
        id: transaction.sender_id,
        fullName: transaction.sender_fullName,
        email: transaction.sender_email,
        idNumber: transaction.sender_idNumber,
        phoneNumber: transaction.sender_phoneNumber,
        isDeleted: transaction.sender_isDeleted,
        role: transaction.sender_role,
      },
    },
  };
  return result;
}
