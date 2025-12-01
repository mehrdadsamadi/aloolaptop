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
import { Transform, Type } from 'class-transformer';
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

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @ValidateIf((o) => o.type === CouponType.PRODUCT)
  @Transform(({ value }) => {
    // اگر رشته است و شبیه JSON آرایه است، parse کن
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        // اگر parse نشد، رشته تکی را آرایه کن
        return [value];
      }
    }
    // اگر مقدار خود آرایه است
    return value;
  })
  @IsArray({ message: 'productIds باید آرایه باشد' })
  @IsMongoId({ each: true, message: 'آیدی محصول معتبر نمیباشد' })
  productIds?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateIf((o) => o.type === CouponType.CART)
  @IsNumber()
  @Type(() => Number)
  minOrderAmount?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
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
