import { ProductCondition } from '../../modules/product/enums/product-condition.enum';
import { ProductGrade } from '../../modules/product/enums/product-grade.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsMongoId, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { PaginationDto } from './pagination.dto';

export class FilterProductDto extends PaginationDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsMongoId()
  categoryId?: string;

  @ApiPropertyOptional({ enum: ProductCondition })
  @IsOptional()
  @IsEnum(ProductCondition)
  condition?: ProductCondition;

  @ApiPropertyOptional({ enum: ProductGrade })
  @IsOptional()
  @IsEnum(ProductGrade)
  grade?: ProductGrade;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === '1' || value === true)
  @IsBoolean()
  isActive?: boolean;
}
