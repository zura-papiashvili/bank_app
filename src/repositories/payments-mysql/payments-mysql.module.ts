import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountEntity } from 'src/entities/account.entity';
import { PaymentEntity } from 'src/entities/payments.entity';

import { TransactionModule } from 'src/modules/transaction/transaction.module';
import { ServicesMysqlModule } from '../services-mysql/services-mysql.module';
import { PaymentsMysqlRepository } from './payments-mysql.repository';
@Module({})
@Module({
  imports: [
    TypeOrmModule.forFeature([PaymentEntity, AccountEntity]),
    ServicesMysqlModule,
    TransactionModule,
  ],
  providers: [PaymentsMysqlRepository],
  exports: [PaymentsMysqlRepository],
})
export class PaymentsMysqlModule {}
