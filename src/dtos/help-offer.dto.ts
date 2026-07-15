import { Transform } from "class-transformer";
import { IsEnum, IsInt, IsOptional, IsString, MaxLength, Min } from "class-validator";
import { HelpOfferStatus } from "../constants/enums";

export class CreateHelpOfferDto {
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  requestId!: number;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  message?: string;
}

export class ListMyHelpOffersQueryDto {
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
  @IsEnum(HelpOfferStatus)
  status?: HelpOfferStatus;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  requestId?: number;

  @IsOptional()
  @IsString()
  search?: string;
}

export class CancelMyHelpOfferDto {
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  cancelReason?: string;
}

export class ListAdminHelpOffersQueryDto extends ListMyHelpOffersQueryDto {
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  helperUserId?: number;

  @IsOptional()
  @IsString()
  city?: string;
}

export class UpdateHelpOfferStatusByAdminDto {
  @IsEnum(HelpOfferStatus)
  status!: HelpOfferStatus;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  adminNote?: string;
}
