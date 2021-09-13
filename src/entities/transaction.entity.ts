import { TransactionStatus } from 'src/enums/transaction-status.enum';
import { TransactionType } from 'src/enums/transaction-type.enum';
import { Account } from 'src/interface/account.interface';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { AccountEntity } from './account.entity';

@Entity('transactions')
export class TransactionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('datetime')
  time: Date;

  @Column('decimal', {
    precision: 20,
    scale: 2,
    unsigned: true,
    default: 0,
  })
  amount: number;

  @ManyToOne(() => AccountEntity, (account) => account.id, { eager: true })
  receiverAccount: number | Account;

  @ManyToOne(() => AccountEntity, (account) => account.id, { eager: true })
  senderAccount: number | Account;

  @Column('enum', { enum: TransactionType })
  type: TransactionType;

  @Column('enum', { enum: TransactionStatus })
  status: TransactionStatus;
}
