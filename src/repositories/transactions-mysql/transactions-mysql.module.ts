import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountEntity } from 'src/entities/account.entity';
import { TransactionEntity } from 'src/entities/transaction.entity';
import { TransactionsMysqlRepository } from './transactions-mysql.repository';

@Module({
  imports: [TypeOrmModule.forFeature([TransactionEntity, AccountEntity])],
  providers: [TransactionsMysqlRepository],
  exports: [TransactionsMysqlRepository],
})
export class TransactionsMysqlModule {}
