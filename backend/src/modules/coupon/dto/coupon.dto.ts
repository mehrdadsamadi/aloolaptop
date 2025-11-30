import {
  IsArray,
  IsDateString,
  IsEnum,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  Validate,
  ValidateIf,
} from 'class-validator';
import { CouponType } from '../enums/coupon-type.enum';
import { DiscountMethod } from '../enums/discount-method.enum';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsStartBeforeEnd } from '../../../common/validators/is-start-before-end.validator';

export class CreateCouponDto {
  @ApiProperty()
  @IsString()
  code: string;

  @ApiProperty({
    enum: CouponType,
  })
  @IsEnum(CouponType)
  type: CouponType;

  @ApiProperty({
    enum: DiscountMethod,
  })
  @IsEnum(DiscountMethod)
  method: DiscountMethod;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @ValidateIf((o) => o.method === DiscountMethod.PERCENT)
  @Max(100, { message: 'درصد تخفیف نمی‌تواند بیش از 100 باشد' })
  value: number;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateIf((o) => o.type === CouponType.PRODUCT)
  @IsArray({ message: 'productIds باید آرایه باشد' })
  @IsMongoId({
    each: true,
    message: 'آیدی محصول معتبر نمیباشد',
  })
  productIds?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateIf((o) => o.type === CouponType.CART)
  @IsNumber()
  @Type(() => Number)
  minOrderAmount?: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  maxUses: number;

  @ApiProperty()
  @IsDateString()
  @Validate(IsStartBeforeEnd)
  startDate: string;

  @ApiProperty()
  @IsDateString()
  endDate: string;
}

export class UpdateCouponDto extends PartialType(CreateCouponDto) {}

export class ValidateCouponDto {
  @ApiProperty()
  @IsString()
  code: string;
}
