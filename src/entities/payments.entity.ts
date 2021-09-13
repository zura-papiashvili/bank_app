import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ServiceEntity } from './services.entity';
import { UserEntity } from './user.entity';

@Entity('payments')
export class PaymentEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column('datetime')
  time: Date;
  @Column('decimal', { precision: 20, scale: 2 })
  amount: number;
  @ManyToOne(() => ServiceEntity, (service) => service.id)
  service: number | ServiceEntity;
  @ManyToOne(() => UserEntity, (user) => user.id)
  user: number | UserEntity;
}
