import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateQuantityDto {
  @ApiProperty({ type: String, example: '64ff2f4b7a1c3b5d12345678' })
  @IsMongoId()
  productId: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @Type(() => Number)
  quantity: number;
}
