import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { AccountEntity } from './entities/account.entity';
import { CompanyEntity } from './entities/company.entity';
import { PaymentEntity } from './entities/payments.entity';
import { ServiceEntity } from './entities/services.entity';
import { TransactionEntity } from './entities/transaction.entity';
import { UserEntity } from './entities/user.entity';
import { AccountsModule } from './modules/accounts/accounts.module';
import { CompaniesModule } from './modules/companies/companies.module';
import { ServicesModule } from './modules/services/services.module';
import { TransactionModule } from './modules/transaction/transaction.module';
import { UsersModule } from './modules/users/users.module';
import { PaymentsModule } from './modules/payments/payments.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'room2',
      password: 'room2',
      database: 'lvl_bank',
      entities: [
        UserEntity,
        AccountEntity,
        CompanyEntity,
        PaymentEntity,
        ServiceEntity,
        TransactionEntity,
      ],
      synchronize: true,
    }),
    AccountsModule,
    TransactionModule,
    UsersModule,
    CompaniesModule,
    AuthModule,
    ServicesModule,
    PaymentsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
