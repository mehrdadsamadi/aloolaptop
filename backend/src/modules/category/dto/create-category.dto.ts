import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AttributeType } from '../enums/attribute-type.enum';

class AttributeDto {
  @ApiProperty({ example: 'ram' }) @IsString() key: string;

  @ApiPropertyOptional({ example: 'رم' })
  @IsOptional()
  @IsString()
  label?: string;

  @ApiPropertyOptional({
    enum: AttributeType,
    default: AttributeType.SELECT,
    example: AttributeType.SELECT,
    description: 'string | number | select | boolean | range',
  })
  @IsOptional()
  @IsEnum(AttributeType)
  type?: AttributeType;

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
  })
  @IsOptional()
  @IsString()
  image?: string;
}
