import {
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';
import { TransactionType } from 'src/enums/transaction-type.enum';

export class CreateTransactionDTO {
  @IsNumber()
  @Min(0)
  amount: number;
  @IsInt()
  senderAccountId: number;
  @IsInt()
  receiverAccountId: number;
  @IsOptional()
  @IsEnum(TransactionType)
  type: TransactionType;
}
