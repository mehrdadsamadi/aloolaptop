import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class AddImageDto {
  @ApiProperty({ example: 'لپتاپ' }) @IsString() title: string;

  @ApiProperty({ format: 'binary' })
  @IsOptional()
  @IsString()
  image: string;
}
