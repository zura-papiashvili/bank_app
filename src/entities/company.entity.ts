import { Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Entity, Unique } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('companies')
@Unique(['companyName', 'email'])
export class CompanyEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column('varchar', {
    length: 100,
  })
  companyName: string;
  @Column('varchar', {
    length: 60,
  })
  email: string;
  @ManyToOne(() => UserEntity, (user) => user.id)
  user: number | UserEntity;
  @Column('boolean', {
    default: false,
  })
  isDeleted: boolean;
}
