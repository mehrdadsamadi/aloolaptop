import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsMongoId, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateReviewDto {
  @ApiProperty({ example: '691c5be7c2bf1d65cbf69944' })
  @IsMongoId()
  productId: string;

  @ApiProperty({ example: 5 })
  @Min(1)
  @Max(5)
  @Type(() => Number)
  rating: number;

  @ApiProperty({ example: 'خیلی عالی بود', required: false })
  @IsOptional()
  @IsString()
  comment?: string;
}

export class UpdateReviewDto {
  @ApiPropertyOptional({ example: 4 })
  @IsOptional()
  @Min(1)
  @Max(5)
  @Type(() => Number)
  rating?: number;

  @ApiPropertyOptional({ example: 'کیفیت خوب بود' })
  @IsOptional()
  @IsString()
  comment?: string;
}
