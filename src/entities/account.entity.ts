import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('accounts')
export class AccountEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, (user) => user.id)
  user: number | UserEntity;

  @Column('varchar', {
    length: 16,
    unique: true,
    nullable: false,
  })
  cardNumber: string;

  @Column('decimal', {
    precision: 20,
    scale: 2,
    unsigned: true,
    default: 0,
  })
  balance: number;

  @Column('varchar', {
    length: 50,
    unique: true,
    nullable: false,
  })
  accountNumber: string;

  @Column({
    type: 'boolean',
    default: false,
  })
  isDeleted: boolean;
}
