import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserEnum } from 'src/enums/user-role.enum';

export class CreateCompanyDto {
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  companyName: string;
  @IsEmail()
  email: string;
  @IsNumber()
  @IsInt()
  userId: number;
}
