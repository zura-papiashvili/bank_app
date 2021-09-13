import { Injectable, Logger } from '@nestjs/common';
import { FillBalanceDTO } from 'src/dto/fill-balance.dto';
import { CreateTransactionDTO } from 'src/dto/transaction-create.dto';
import { GetAllTransactionsDTO } from 'src/dto/transactions-get-all.dto';
import { BalancingResponse } from 'src/enums/transaction-balancing.enum';
import { TransactionStatus } from 'src/enums/transaction-status.enum';
import { TransactionType } from 'src/enums/transaction-type.enum';
import { Transaction } from 'src/interface/transaction.interface';
import { AccountsMysqlRepository } from 'src/repositories/accounts-mysql/accounts-mysql.repository';
import { TransactionsMysqlRepository } from 'src/repositories/transactions-mysql/transactions-mysql.repository';

@Injectable()
export class TransactionService {
  private readonly logger = new Logger(this.constructor.name);
  constructor(
    private readonly transactionRepository: TransactionsMysqlRepository,
    private readonly accountRepository: AccountsMysqlRepository,
  ) {}

  async createTransaction(data: CreateTransactionDTO, userId: number) {
    try {
      const isOwner = await this.accountRepository.checkAccountOwner(
        data.senderAccountId,
        userId,
      );
      this.logger.log(`is owner: ${isOwner}`);
      if (!isOwner) {
        return { message: 'AccountNumber is not Valid' };
      }
      const haveEnoughMoney = await this.accountRepository.haveEnoughMoney(
        data.senderAccountId,
        data.amount,
      );
      if (!haveEnoughMoney) {
        return { message: BalancingResponse.NOMONEY };
      }

      const sameOwner = await this.accountRepository.haveSameOwner(
        data.senderAccountId,
        data.receiverAccountId,
      );
      this.logger.log(`same owner: ${sameOwner}`);

      data.type = sameOwner
        ? TransactionType.Transfer
        : TransactionType.Private;
      const newTransaction = await this.transactionRepository.createTransaction(
        data,
        sameOwner,
      );

      const message = await this.accountRepository.transactionBalancing(
        newTransaction,
      );
      this.logger.log(`transaction status: ${message}`);

      return { newTransaction, message };
    } catch (error) {
      this.logger.log(`error: ${error.message}`);
      return null;
    }
  }

  async getPendingTransactions(): Promise<Transaction[]> {
    try {
      const pendingTransactions =
        await this.transactionRepository.getPendingTransactions();
      this.logger.log(`pending transactions: ${pendingTransactions}`);

      return pendingTransactions;
    } catch (error) {
      this.logger.log(`error: ${error.message}`);
      return null;
    }
  }

  async confirmPendingTransactionById(
    id: number,
  ): Promise<string | Transaction> {
    try {
      const foundTransaction =
        await this.transactionRepository.getTransactionById(id);
      if (foundTransaction.status === TransactionStatus.Sent) {
        return 'Transaction is already sent';
      } else {
        const confirmed =
          await this.transactionRepository.confirmPendingTransactionById(id);
        if (confirmed) {
          foundTransaction.status = TransactionStatus.Sent;
        } else {
          return BalancingResponse.NEEDCONFIRM;
        }

        const message = await this.accountRepository.transactionBalancing(
          foundTransaction,
        );

        return foundTransaction;
      }
    } catch (error) {
      this.logger.log(`error: ${error.message}`);
      return null;
    }
  }

  async rejectTransactionById(id: number): Promise<String> {
    try {
      await this.transactionRepository.rejectTransactionById(id);
      return 'Transaction was rejected';
    } catch (error) {
      const result = this.logger.log(`reject pending  error: ${error}`);
      return null;
    }
  }

  async depositIntoAccount(data: FillBalanceDTO): Promise<Transaction> {
    try {
      data.type = TransactionType.Deposit;
      const newDeposit = await this.transactionRepository.depositIntoAccount(
        data,
      );
      data.amount = Math.abs(data.amount);
      await this.accountRepository.fillBalance(data);
      delete newDeposit.senderAccountId;
      return newDeposit;
    } catch (error) {
      this.logger.log(`service filling balance error: ${error.message}`);
      return null;
    }
  }
  async withdrawFromAccount(
    data: FillBalanceDTO,
  ): Promise<Boolean | Transaction> {
    try {
      data.type = TransactionType.Withdraw;
      const newDeposit = await this.transactionRepository.depositIntoAccount(
        data,
      );
      data.amount = -Math.abs(data.amount);
      const isEnoughMoney = await this.accountRepository.fillBalance(data);
      delete newDeposit.receiverAccountId;

      return isEnoughMoney ? newDeposit : false;
    } catch (error) {
      this.logger.log(`service filling balance error: ${error.message}`);
      return null;
    }
  }
  async getAllTransactions(
    query: GetAllTransactionsDTO,
  ): Promise<Transaction[]> {
    const transactions = await this.transactionRepository.getAllTransactions(
      query,
    );
    return transactions;
  }

  async getAllMyTransactions(
    query: GetAllTransactionsDTO,
    myId: number,
  ): Promise<Transaction[]> {
    const myAccounts = await this.accountRepository.getAccountsByUserId(myId);

    const myAccountNumbers = myAccounts.map((account) => account.accountNumber);
    this.logger.log(`myacounts: ${myAccountNumbers}`);
    const transactions = await this.transactionRepository.getAllTransactions(
      query,
      myAccountNumbers,
    );
    return transactions;
  }
}
