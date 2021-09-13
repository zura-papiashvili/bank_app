import { IsEmail, IsEnum, IsNumber, IsString, MinLength } from "class-validator";
import { UserEnum } from "src/enums/user-role.enum";

export class RegisterUserDto {
    @IsString()
    fullName: string;
    @IsEmail()
    email: string;
    @IsString()
    idNumber: string;
    @IsString()
    phoneNumber: string;
    @IsString()
    @MinLength(4)
    password: string;
    @IsEnum(UserEnum)
    role: UserEnum;
}