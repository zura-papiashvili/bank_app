import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountEntity } from 'src/entities/account.entity';
import { UserEntity } from 'src/entities/user.entity';
import { AccountsMysqlRepository } from './accounts-mysql.repository';

@Module({
  imports: [TypeOrmModule.forFeature([AccountEntity, UserEntity])],
  providers: [AccountsMysqlRepository],
  exports: [AccountsMysqlRepository],
})
export class AccountsMysqlModule {}
