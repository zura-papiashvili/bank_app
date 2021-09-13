import { UserEnum } from 'src/enums/user-role.enum';
import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('users')
@Unique(['email', 'idNumber', 'phoneNumber'])
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column('varchar', {
    length: 50,
  })
  fullName: string;
  @Column('varchar', {
    length: 60,
  })
  email: string;

  @Column('varchar', {
    length: 11,
  })
  idNumber: string;
  @Column('varchar')
  phoneNumber: string;
  @Column('varchar', {
    length: 150,
  })
  hash: string;
  @Column('boolean', {
    default: false,
  })
  isDeleted: boolean;
  @Column('enum', {
    enum: UserEnum,
  })
  role: UserEnum;
}
