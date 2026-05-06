import { Transform } from "class-transformer";
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min
} from "class-validator";
import { ServiceFieldType } from "../constants/enums";

export class CreateServiceDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;
}

export class UpdateServiceDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;
}

export class CreateServiceFieldDto {
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  serviceId!: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  fieldName!: string;

  @IsEnum(ServiceFieldType)
  fieldType!: ServiceFieldType;

  @Transform(({ value }) => value === true || value === "true")
  @IsBoolean()
  required!: boolean;
}

export class UpdateServiceFieldDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  fieldName?: string;

  @IsOptional()
  @IsEnum(ServiceFieldType)
  fieldType?: ServiceFieldType;

  @IsOptional()
  @Transform(({ value }) => value === true || value === "true")
  @IsBoolean()
  required?: boolean;
}

export class ListServiceFieldsQueryDto {
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  serviceId?: number;
}
