import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { AccountsMysqlModule } from 'src/repositories/accounts-mysql/accounts-mysql.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AccountsMysqlModule, AuthModule],
  providers: [AccountsService],
  controllers: [AccountsController],
})
export class AccountsModule {}
