import { Type } from 'class-transformer';
import { IsArray, IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

class TimeBlockBundleDto {
  @IsNumber()
  @IsNotEmpty()
  hours: number;

  @IsNumber()
  @IsNotEmpty()
  price: number;
}

class MonthlyPassDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;
}

class PromoCodeDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsNumber()
  @IsNotEmpty()
  discountPercentage: number;

  @IsDate()
  @IsOptional()
  validUntil?: Date;
}

class SpecialEventOverrideDto {
  @IsDate()
  @IsNotEmpty()
  date: Date;

  @IsNumber()
  @IsNotEmpty()
  price: number;
}

export class PricingDto {
  @IsNumber()
  @IsOptional()
  hourlyRate?: number;

  @IsNumber()
  @IsOptional()
  dailyRate?: number;

  @IsNumber()
  @IsOptional()
  peakMultiplier?: number;

  @IsNumber()
  @IsOptional()
  offPeakMultiplier?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TimeBlockBundleDto)
  @IsOptional()
  timeBlockBundles?: TimeBlockBundleDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MonthlyPassDto)
  @IsOptional()
  monthlyPasses?: MonthlyPassDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PromoCodeDto)
  @IsOptional()
  promoCodes?: PromoCodeDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SpecialEventOverrideDto)
  @IsOptional()
  specialEventOverrides?: SpecialEventOverrideDto[];
}
