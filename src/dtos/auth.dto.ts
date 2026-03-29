import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Min
} from "class-validator";
import { AccountType } from "../constants/enums";

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 150)
  name!: string;

  @IsString()
  @IsNotEmpty()
  phone!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 50)
  username!: string;

  @IsString()
  @Length(8, 50)
  password!: string;

  @IsString()
  @IsNotEmpty()
  nationalId!: string;

  @IsString()
  @IsNotEmpty()
  city!: string;

  @IsString()
  @IsNotEmpty()
  socialStatus!: string;

  @IsInt()
  @Min(1)
  familyMembersNumber!: number;

  @IsOptional()
  @IsEnum(AccountType)
  accountType?: AccountType;
}

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  identifier!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}
