import {
  IsDecimal,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateAccountDTO {
  @IsString()
  @Length(16, 16)
  cardNumber: string;
  @IsOptional()
  @IsNumber()
  balance?: number;
  @IsString()
  @Length(22, 22)
  accountNumber: string;
  @IsInt()
  userId: number;
}
