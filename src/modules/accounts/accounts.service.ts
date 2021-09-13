import { Injectable, Logger } from '@nestjs/common';
import { CreateAccountDTO } from 'src/dto/account-create.dto';
import { GetAllAccountDTO } from 'src/dto/account-get-all.dto';
import {
  AccountAndId,
  createAccountAndidInterface,
} from 'src/interface/account-and-id.interface';
import { Account } from 'src/interface/account.interface';
import { AccountsMysqlRepository } from 'src/repositories/accounts-mysql/accounts-mysql.repository';

@Injectable()
export class AccountsService {
  private readonly logger = new Logger(this.constructor.name);
  constructor(private readonly accountRepository: AccountsMysqlRepository) {}
  async getAccountsByIdNumber(idNumber: string): Promise<AccountAndId[]> {
    try {
      const accounts = await this.accountRepository.getAccountsByIdNumber(
        idNumber,
      );
      this.logger.log(`acount numbers: ${accounts}`);
      const accountAndId: AccountAndId[] = accounts.map((account) =>
        createAccountAndidInterface(account),
      );
      return accountAndId;
    } catch (error) {
      this.logger.log(`error: ${error.message}`);
      return null;
    }
  }

  async createAccount(data: CreateAccountDTO): Promise<Account> {
    try {
      const newAccount = await this.accountRepository.createAccount(data);
      return newAccount;
    } catch (error) {
      this.logger.log(`error: ${error.message}`);
      return null;
    }
  }

  async deleteAccountById(id: number): Promise<String> {
    try {
      const accountExist = await this.accountRepository.checkAccountById(id);
      if (!accountExist) {
        return "Account doesn't exist with given id";
      } else {
        return await this.accountRepository.deleteAccountById(id);
      }
    } catch (error) {
      this.logger.log(`error: ${error.message}`);
      return null;
    }
  }
  async getAccounts(query: GetAllAccountDTO): Promise<Account[]> {
    try {
      const account = await this.accountRepository.getAccounts(query);

      return account;
    } catch (error) {
      this.logger.log(`sss error: ${error.message}`);
      return null;
    }
  }

  async getMyAccounts(myId: number): Promise<Account[]> {
    try {
      const myAccounts = await this.accountRepository.getAccountsByUserId(myId);
      this.logger.log(`account numbers: ${myAccounts}`);
      return myAccounts;
    } catch (error) {
      this.logger.log(`error: ${error.message}`);
      return null;
    }
  }
}
