import { IsString } from "class-validator";

export class UpdateCompanyDto{
    @IsString()
    companyName: string;
}