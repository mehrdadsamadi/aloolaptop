import {
  IsArray,
  IsBoolean,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class AttributeDto {
  @ApiProperty({ example: 'ram' }) @IsString() key: string;

  @ApiPropertyOptional({ example: 'رم' })
  @IsOptional()
  @IsString()
  label?: string;

  @ApiPropertyOptional({
    example: 'select',
    description: 'string | number | select | boolean | range',
  })
  @IsOptional()
  @IsString()
  type?: 'string' | 'number' | 'select' | 'boolean' | 'range';

  @ApiPropertyOptional({ example: ['4GB', '8GB', '16GB'] })
  @IsOptional()
  @IsArray()
  options?: string[];

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  showInFilter?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  required?: boolean;
}

export class CreateCategoryDto {
  @ApiProperty({ example: 'لپتاپ' }) @IsString() name: string;

  @ApiPropertyOptional({ example: 'laptop' })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional({ example: 'تمام لپتاپ‌های دست دوم و نو' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: null })
  @IsOptional()
  @IsMongoId()
  parentId?: string;

  @ApiPropertyOptional({
    type: [AttributeDto],
    example: [
      {
        key: 'ram',
        label: 'رم',
        type: 'select',
        options: ['4GB', '8GB'],
        showInFilter: true,
        required: true,
      },
    ],
  })
  @IsOptional()
  @IsArray()
  @Type(() => AttributeDto)
  @Transform(({ value }) =>
    typeof value === 'string' ? JSON.parse(value) : value,
  )
  attributes?: AttributeDto[];

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  isActive?: boolean;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  order?: number;

  @ApiPropertyOptional({
    format: 'binary',
    example: '/uploads/category/laptop.png',
  })
  @IsOptional()
  @IsString()
  image?: string;
}
