import { ProductCondition } from '../../modules/product/enums/product-condition.enum';
import { ProductGrade } from '../../modules/product/enums/product-grade.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsMongoId,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { PaginationDto } from './pagination.dto';
import { OrderStatus } from '../../modules/order/enums/order-status.enum';
import { TopSellingSortBy } from '../../modules/statistic/enums/top-selling-sortBy.enum';

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

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;
}

export class FilterCategoryDto extends PaginationDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  _id?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;
}

export class FilterOrderDto extends PaginationDto {
  @ApiPropertyOptional({ enum: OrderStatus })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;
}

export class FilterTopSellingProductsDto {
  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;

  @ApiPropertyOptional({ enum: TopSellingSortBy })
  @IsOptional()
  @IsEnum(TopSellingSortBy)
  sortBy?: TopSellingSortBy;
}
