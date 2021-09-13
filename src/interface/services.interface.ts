import { TypeEnum } from 'src/enums/type.enum';

export interface Services {
  id: number;
  name: String;
  type: TypeEnum;
  company: number;
  account: number;
  isDeleted?: boolean;
}
