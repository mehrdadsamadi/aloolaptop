import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProductCondition } from '../enums/product-condition.enum';
import { ProductGrade } from '../enums/product-grade.enum';

class AttributeDto {
  @ApiProperty({ example: 'ram' }) @IsString() key: string;

  @ApiPropertyOptional({ example: 'رم' })
  @IsOptional()
  @IsString()
  label?: string;

  @ApiProperty({ example: '8GB' })
  @IsString()
  value: string;
}

export class CreateProductDto {
  @ApiProperty({ example: 'لپتاپ ایسوس مدل X123' }) @IsString() name: string;

  @ApiProperty({ example: 'asus-x123' }) @IsString() slug: string;

  @ApiPropertyOptional({ example: 'لپتاپ دست دوم با مشخصات عالی' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ type: String, example: '64ff2f4b7a1c3b5d12345678' })
  @IsMongoId()
  categoryId: string;

  @ApiProperty({ enum: ProductCondition, example: ProductCondition.USED })
  @IsEnum(ProductCondition)
  condition: ProductCondition;

  @ApiPropertyOptional({ enum: ProductGrade, example: ProductGrade.A_PLUS })
  @IsOptional()
  @IsEnum(ProductGrade)
  grade: ProductGrade;

  @ApiProperty({ example: 15000000 })
  @IsNumber()
  @Type(() => Number)
  price: number;

  @ApiPropertyOptional({ example: 5 })
  @IsOptional()
  @Type(() => Number)
  stock?: number;

  @ApiPropertyOptional({
    type: [AttributeDto],
    example: [
      { key: 'ram', label: 'رم', value: '8GB' },
      { key: 'cpu', label: 'پردازنده', value: 'i5 10th Gen' },
    ],
  })
  @IsOptional()
  @IsArray()
  @Transform(({ value }) =>
    typeof value === 'string' ? JSON.parse(value) : value,
  )
  attributes?: AttributeDto[];

  @ApiProperty({ format: 'binary' })
  @IsArray()
  images: string[];

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  isActive?: boolean;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @Max(100)
  discountPercent?: number;

  @ApiPropertyOptional({ example: '2025-12-31T23:59:59.000Z' })
  @IsOptional()
  discountExpiresAt?: Date;
}
