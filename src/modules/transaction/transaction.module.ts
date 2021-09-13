import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { TransactionsMysqlModule } from 'src/repositories/transactions-mysql/transactions-mysql.module';
import { AccountsMysqlModule } from 'src/repositories/accounts-mysql/accounts-mysql.module';

@Module({
  imports: [TransactionsMysqlModule, AccountsMysqlModule],
  providers: [TransactionService, TransactionController],
  controllers: [TransactionController],
  exports: [TransactionController],
})
export class TransactionModule {}
