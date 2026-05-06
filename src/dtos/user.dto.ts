import { Transform } from "class-transformer";
import {
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Min
} from "class-validator";
import { UserRole } from "../constants/enums";

export class CreateUserByAdminDto {
  @IsString()
  @Length(2, 150)
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @Length(8, 50)
  password!: string;

  @IsString()
  phone!: string;

  @IsString()
  city!: string;

  @IsEnum(UserRole)
  role!: UserRole;
}

export class UpdateUserByAdminDto {
  @IsOptional()
  @IsString()
  @Length(2, 150)
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}

export class ListUsersQueryDto {
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  limit?: number;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
