import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TypeEnum } from 'src/enums/type.enum';

export class UpdateServiceDTO {
  @IsOptional()
  @IsString()
  name?: String;
  @IsOptional()
  @IsEnum(TypeEnum)
  type?: TypeEnum;
}
