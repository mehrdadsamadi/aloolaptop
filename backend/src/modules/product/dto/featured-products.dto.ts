import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class FeaturedProductsDto {
  @ApiPropertyOptional({
    description: 'تعداد محصولات',
    default: 8,
    minimum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  limit?: number = 8;
}

export class BestSellersDto extends FeaturedProductsDto {
  @ApiPropertyOptional({
    description: 'دوره زمانی (روز)',
    default: 30,
    minimum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  days?: number = 30;
}
