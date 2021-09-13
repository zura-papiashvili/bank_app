import { IsEnum, IsInt, IsString } from 'class-validator';
import { TypeEnum } from 'src/enums/type.enum';

export class CreateServiceDTO {
  @IsString()
  name: String;
  @IsEnum(TypeEnum)
  type: TypeEnum;
  @IsInt()
  company: number;
  @IsInt()
  account: number;
}
