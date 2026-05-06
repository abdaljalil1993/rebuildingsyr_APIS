import { Transform } from "class-transformer";
import {
  ArrayNotEmpty,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  Min,
  ValidateNested
} from "class-validator";
import { Type } from "class-transformer";
import { MediaType, RequestStatus } from "../constants/enums";

export class RequestFieldValueDto {
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  fieldId!: number;

  @IsString()
  @IsNotEmpty()
  value!: string;
}

export class RequestMediaDto {
  @IsString()
  @IsNotEmpty()
  filePath!: string;

  @IsString()
  @IsOptional()
  @IsUrl({ require_tld: false }, { message: "url must be a valid URL when provided" })
  url?: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(MediaType)
  type!: MediaType;
}

export class CreateRequestDto {
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  serviceId!: number;

  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => RequestFieldValueDto)
  data!: RequestFieldValueDto[];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => RequestMediaDto)
  media?: RequestMediaDto[];
}

export class UpdateRequestDto {
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => RequestFieldValueDto)
  data?: RequestFieldValueDto[];
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
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  serviceId?: number;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  search?: string;
}

export class ReviewerListRequestsQueryDto extends ListRequestsQueryDto {
  @IsOptional()
  @IsString()
  mode?: "assigned" | "all";
}

export class UpdateRequestStatusDto {
  @IsEnum(RequestStatus)
  status!: RequestStatus;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  rejectionReason?: string;
}

export class CreateRequestNoteDto {
  @IsString()
  @IsNotEmpty()
  note!: string;
}
