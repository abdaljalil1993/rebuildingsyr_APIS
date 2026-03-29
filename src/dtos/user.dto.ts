import { IsInt, IsOptional, IsString, Length, Min } from "class-validator";

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @Length(2, 150)
  name?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  socialStatus?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  familyMembersNumber?: number;
}
