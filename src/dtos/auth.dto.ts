import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length
} from "class-validator";
import { UserRole } from "../constants/enums";

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
  @Length(8, 50)
  password!: string;

  @IsString()
  @IsNotEmpty()
  city!: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}

export class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}
