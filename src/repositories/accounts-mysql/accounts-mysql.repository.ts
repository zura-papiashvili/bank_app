import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAccountDTO } from 'src/dto/account-create.dto';
import { GetAllAccountDTO } from 'src/dto/account-get-all.dto';
import { FillBalanceDTO } from 'src/dto/fill-balance.dto';
import { AccountEntity } from 'src/entities/account.entity';
import { BalancingResponse } from 'src/enums/transaction-balancing.enum';
import { TransactionStatus } from 'src/enums/transaction-status.enum';
import {
  Account,
  createAccountInterface,
} from 'src/interface/account.interface';
import { Transaction } from 'src/interface/transaction.interface';
import { escapeLikeString } from 'src/utils/escape-like-string.function';
import { Repository } from 'typeorm/repository/Repository';

@Injectable()
export class AccountsMysqlRepository {
  private readonly logger = new Logger(this.constructor.name);
  constructor(
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
  ) {}

  async getAccountsByUserId(userId: number): Promise<Account[]> {
    try {
      const queryBuilder = this.accountRepository.createQueryBuilder('account');
      queryBuilder.where('account.isDeleted=false');
      queryBuilder.andWhere('account.userId=:userId', { userId });
      queryBuilder.loadAllRelationIds();
      const accounts = await queryBuilder.getMany();
      const accountNumbers = accounts.map((account) =>
        createAccountInterface(account),
      );
      this.logger.log(`account numbers: ${accountNumbers}`);
      return accountNumbers;
    } catch (error) {
      this.logger.log(`error: ${error.message}`);
      return null;
    }
  }
  async getAccountsByIdNumber(idNumber: string): Promise<Account[]> {
    try {
      const queryBuilder = this.accountRepository.createQueryBuilder('account');
      queryBuilder.where('account.isDeleted=false');
      queryBuilder.leftJoinAndSelect('account.user', 'user');
      queryBuilder.andWhere('user.idNumber=:idNumber', { idNumber });
      const accounts = await queryBuilder.getMany();

      const accountNumbers = accounts.map((account) =>
        createAccountInterface(account),
      );
      this.logger.log(`account numbers: ${accountNumbers}`);
      return accountNumbers;
    } catch (error) {
      this.logger.log(`error: ${error.message}`);
      return null;
    }
  }

  async checkAccountOwner(accountId: number, userId: number): Promise<boolean> {
    try {
      const account = await this.accountRepository.findOne(accountId, {
        relations: ['user'],
      });

      this.logger.log(`is owner: ${account.user['id'] === userId}`);
      return account.user['id'] === userId;
    } catch (error) {
      this.logger.log(`error: ${error.message}`);
      return null;
    }
  }

  async haveEnoughMoney(
    AccountId: number,
    amount: number,
  ): Promise<boolean | Number> {
    try {
      const account = await this.accountRepository.findOne(AccountId);
      const newBalance = Number(account.balance) - Number(amount);
      return newBalance < 0 ? false : newBalance;
    } catch (error) {
      this.logger.log(` have enough Money error: ${error.message}`);
      return null;
    }
  }
  async transactionBalancing(
    transaction: Transaction,
  ): Promise<BalancingResponse> {
    try {
      if (transaction.status === TransactionStatus.Pending) {
        return BalancingResponse.NEEDCONFIRM;
      } else {
        this.logger.log(`balancing: ${transaction}`);

        const senderId: number = Number(transaction.senderAccountId);

        const senderNewBalance = await this.haveEnoughMoney(
          senderId,
          transaction.amount,
        );

        if (!senderNewBalance) {
          return BalancingResponse.NOMONEY;
        }

        await this.accountRepository.update(transaction.senderAccountId, {
          balance: Number(senderNewBalance),
        });
        this.logger.log(`balancing: ${senderNewBalance}`);

        const receiver: number = Number(transaction.receiverAccountId);

        const receiverBalance = await this.accountRepository.findOne(receiver);
        this.logger.log(`balancing: ${receiverBalance.balance}`);

        await this.accountRepository.update(transaction.receiverAccountId, {
          balance: Number(receiverBalance.balance) + Number(transaction.amount),
        });

        return BalancingResponse.SUCCESS;
      }
    } catch (error) {
      this.logger.log(` balancing error: ${error}`);
      return null;
    }
  }

  async createAccount(data: CreateAccountDTO): Promise<Account> {
    try {
      const newAccount = new AccountEntity();

      newAccount.user = data.userId;
      newAccount.cardNumber = data.cardNumber;
      newAccount.balance = data.balance;
      newAccount.accountNumber = data.accountNumber;
      const createdAccount = await this.accountRepository.save(newAccount);
      return createAccountInterface(createdAccount);
    } catch (error) {
      this.logger.log(`error: ${error.message}`);
      return null;
    }
  }

  async deleteAccountById(id: number): Promise<String> {
    try {
      await this.accountRepository.update(id, {
        isDeleted: true,
      });

      return 'Account was successfully deleted';
    } catch (error) {
      this.logger.log(`error: ${error.message}`);
      return null;
    }
  }
  async checkAccountById(id: number): Promise<Boolean> {
    try {
      const count = await this.accountRepository.count({
        where: { id, isDeleted: false },
      });
      return count > 0;
    } catch (error) {
      this.logger.log(`error: ${error.message}`);
      return null;
    }
  }

  async getAccounts(query: GetAllAccountDTO): Promise<Account[]> {
    const queryBuilder = this.accountRepository.createQueryBuilder();
    queryBuilder.where('isDeleted=false');
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

    const accounts = result.map((account) => createAccountInterface(account));
    return accounts;
  }

  async haveSameOwner(idOne: number, idTwo: number): Promise<boolean> {
    try {
      const accountOne = await this.accountRepository.findOneOrFail(idOne, {
        relations: ['user'],
      });
      const accountTwo = await this.accountRepository.findOneOrFail(idTwo, {
        relations: ['user'],
      });
      const userOne = accountOne.user['id'];
      const userTwo = accountTwo.user['id'];

      this.logger.log(`owners: ${userOne === userTwo}`);
      return userOne === userTwo;
    } catch (error) {}
  }

  async fillBalance(data: FillBalanceDTO): Promise<boolean> {
    try {
      const foundAccount = await this.accountRepository.findOne(
        data.receiverAccountId,
      );

      const newBalance = Number(foundAccount.balance) + Number(data.amount);
      if (newBalance < 0) {
        return false;
      } else {
        await this.accountRepository.update(data.receiverAccountId, {
          balance: newBalance,
        });
        return true;
      }
    } catch (error) {
      this.logger.log(`error: ${error}`);
      return null;
    }
  }
}
