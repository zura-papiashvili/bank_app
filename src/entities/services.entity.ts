import { TypeEnum } from 'src/enums/type.enum';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { AccountEntity } from './account.entity';
import { CompanyEntity } from './company.entity';

@Entity('services')
export class ServiceEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column('varchar', {
    length: 50,
    unique: true,
  })
  name: String;
  @Column({
    type: 'enum',
    enum: TypeEnum,
  })
  type: TypeEnum;
  @ManyToOne(() => CompanyEntity, (company) => company.id)
  company: number | CompanyEntity;
  @ManyToOne(() => AccountEntity, (account) => account.id)
  account: number | AccountEntity;

  @Column({
    type: 'boolean',
    default: false,
  })
  isDeleted: boolean;
}
