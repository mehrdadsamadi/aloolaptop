import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsMongoId, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class AddItemDto {
  @ApiProperty({ type: String, example: '64ff2f4b7a1c3b5d12345678' })
  @IsMongoId()
  productId: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  quantity?: number;
}
