import { Transform } from "class-transformer";
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min
} from "class-validator";
import { RequestStatus, RequestType } from "../constants/enums";

export class CreateRequestDto {
  @IsEnum(RequestType)
  reqType!: RequestType;

  @IsDateString()
  reqDate!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @Transform(({ value }) => value === true || value === "true")
  @IsBoolean()
  withDocs!: boolean;

  @IsString()
  @IsNotEmpty()
  buildingNumber!: string;
}

export class UpdateRequestDto {
  @IsOptional()
  @IsEnum(RequestType)
  reqType?: RequestType;

  @IsOptional()
  @IsDateString()
  reqDate?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;

  @IsOptional()
  @Transform(({ value }) => value === true || value === "true")
  @IsBoolean()
  withDocs?: boolean;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  buildingNumber?: string;
}

export class ListRequestsQueryDto {
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
  @IsEnum(RequestStatus)
  status?: RequestStatus;

  @IsOptional()
  @IsEnum(RequestType)
  type?: RequestType;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  search?: string;
}

export class UpdateRequestStatusDto {
  @IsEnum(RequestStatus)
  status!: RequestStatus;
}

export class CreateDamageReportDto {
  @IsString()
  @IsNotEmpty()
  reportBy!: string;

  @IsDateString()
  reportDate!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;
}
