import { Module } from '@nestjs/common';
import { AccountsMysqlModule } from 'src/repositories/accounts-mysql/accounts-mysql.module';
import { PaymentsMysqlModule } from 'src/repositories/payments-mysql/payments-mysql.module';
import { ServicesMysqlModule } from 'src/repositories/services-mysql/services-mysql.module';
import { TransactionsMysqlModule } from 'src/repositories/transactions-mysql/transactions-mysql.module';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';

@Module({
  imports: [
    PaymentsMysqlModule,
    AccountsMysqlModule,
    TransactionsMysqlModule,
    ServicesMysqlModule,
  ],

  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
