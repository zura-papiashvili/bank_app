import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FillBalanceDTO } from 'src/dto/fill-balance.dto';
import { CreateTransactionDTO } from 'src/dto/transaction-create.dto';
import { GetAllTransactionsDTO } from 'src/dto/transactions-get-all.dto';
import { AccountEntity } from 'src/entities/account.entity';
import { TransactionEntity } from 'src/entities/transaction.entity';
import { BalancingResponse } from 'src/enums/transaction-balancing.enum';
import { TransactionStatus } from 'src/enums/transaction-status.enum';
import { TransactionType } from 'src/enums/transaction-type.enum';
import {
  createPendingTransactionInterface,
  createTransactionByIdInterface,
  createTransactionInterface,
  Transaction,
} from 'src/interface/transaction.interface';
import { escapeLikeString } from 'src/utils/escape-like-string.function';
import { Repository } from 'typeorm/repository/Repository';

@Injectable()
export class TransactionsMysqlRepository {
  private readonly logger = new Logger(this.constructor.name);
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly transactionRepository: Repository<TransactionEntity>,
  ) {}

  async createTransaction(
    data: CreateTransactionDTO,
    sameOwner = false,
  ): Promise<Transaction> {
    try {
      const newTransaction = new TransactionEntity();
      const amount = Math.abs(data.amount);
      newTransaction.time = new Date();
      newTransaction.type = data.type;

      newTransaction.status =
        amount > 10000 && !sameOwner
          ? TransactionStatus.Pending
          : TransactionStatus.Sent;
      newTransaction.amount = amount;
      newTransaction.senderAccount = data.senderAccountId;
      newTransaction.receiverAccount = data.receiverAccountId;
      await this.transactionRepository.save(newTransaction);

      return createTransactionInterface(newTransaction);
    } catch (error) {
      this.logger.log(`error: ${error.message}`);
      return null;
    }
  }

  async getPendingTransactions(): Promise<Transaction[]> {
    try {
      const queryBuilder =
        this.transactionRepository.createQueryBuilder('transaction');
      queryBuilder.where('transaction.status=:status', {
        status: TransactionStatus.Pending,
      });

      queryBuilder.leftJoinAndSelect(
        'transaction.receiverAccount',
        'receiverAccounts',
      );
      queryBuilder.leftJoinAndSelect('receiverAccounts.user', 'receiver');
      queryBuilder.leftJoinAndSelect(
        'transaction.senderAccount',
        'senderAccounts',
      );
      queryBuilder.leftJoinAndSelect('senderAccounts.user', 'sender');
      queryBuilder.loadAllRelationIds();
      const result = await queryBuilder.getRawMany();

      const pendingTransactions = result.map((transaction) =>
        createPendingTransactionInterface(transaction),
      );
      this.logger.log(`pending transactions: ${pendingTransactions}`);

      return pendingTransactions;
    } catch (error) {
      this.logger.log(`error: ${error.message}`);
      return null;
    }
  }

  async confirmPendingTransactionById(id: number): Promise<Boolean> {
    try {
      await this.transactionRepository.update(id, {
        status: TransactionStatus.Sent,
      });
      return true;
    } catch (error) {
      this.logger.log(`confirm error: ${error.message}`);
      return null;
    }
  }

  async getTransactionById(transactionId: number): Promise<Transaction> {
    try {
      const queryBuilder =
        this.transactionRepository.createQueryBuilder('transaction');

      queryBuilder.where('transaction.id=:Id', { Id: transactionId });
      queryBuilder.loadAllRelationIds();
      const foundTransaction = await queryBuilder.getRawOne();
      this.logger.log(`foundTransaction: ${foundTransaction}`);

      return createTransactionByIdInterface(foundTransaction);
    } catch (error) {
      this.logger.log(`get transactionby id error: ${error.message}`);
      return null;
    }
  }

  async depositIntoAccount(data: FillBalanceDTO): Promise<Transaction> {
    try {
      const newTransaction = new TransactionEntity();
      const amount = Math.abs(data.amount);
      newTransaction.time = new Date();
      newTransaction.type = data.type;
      newTransaction.status = TransactionStatus.Sent;
      newTransaction.amount = amount;
      newTransaction.senderAccount = data.receiverAccountId;
      newTransaction.receiverAccount = data.receiverAccountId;
      const createdTransaction = await this.transactionRepository.save(
        newTransaction,
      );
      return createTransactionInterface(createdTransaction);
    } catch (error) {
      this.logger.log(`repo filling balance error: ${error}`);
      return null;
    }
  }

  async rejectTransactionById(id: number) {
    try {
      await this.transactionRepository.update(id, {
        status: TransactionStatus.Rejected,
      });
    } catch (error) {
      this.logger.log(`reject pending  error: ${error}`);
      return null;
    }
  }

  async getAllTransactions(
    query: GetAllTransactionsDTO,
    myAccountNumbers?: string[],
  ): Promise<Transaction[]> {
    try {
      const queryBuilder = this.transactionRepository.createQueryBuilder();
      if (query.myId) {
        queryBuilder.where('senderAccountId IN (:myAccountNumbers)', {
          myAccountNumbers,
        });
        queryBuilder.orWhere('receiverAccountId In (:myAccountNumbers)', {
          myAccountNumbers,
        });
      }

      if (query.sortBy) {
        queryBuilder.orderBy(query.sortBy, query.sortDir);
      }

      if (query.searchBy) {
        const column = Object.keys(query.searchBy)[0];
        queryBuilder.where(`${column} like :value`, {
          value: `%${escapeLikeString(query.searchBy[column])}%`,
        });
      }

      if (query.limit) {
        const limit = Math.min(query.limit, 25);
        queryBuilder.limit(limit);

        const page = query.page ? query.page - 1 : 0;
        queryBuilder.offset(page * limit);
      } else {
        queryBuilder.limit(25);
      }
      queryBuilder.loadAllRelationIds();
      const result = await queryBuilder.getMany();

      const transactions = result.map((transaction) =>
        createTransactionInterface(transaction),
      );
      return transactions;
    } catch (error) {
      this.logger.log(`get all: ${error}`);
      return null;
    }
  }
}
