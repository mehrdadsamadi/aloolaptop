import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAddressDto {
  @ApiProperty({ example: 'خانه' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'تهران' })
  @IsString()
  city: string;

  @ApiProperty({ example: 'تهران' })
  @IsString()
  state: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  postalCode: string;

  @ApiProperty({ example: 'خیابان انقلاب، پلاک 1' })
  @IsString()
  address: string;

  @ApiProperty({ example: 35.7 })
  @Type(() => Number)
  @IsNumber()
  latitude: number;

  @ApiProperty({ example: 51.4167 })
  @Type(() => Number)
  @IsNumber()
  longitude: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}

export class UpdateAddressDto extends PartialType(CreateAddressDto) {}
