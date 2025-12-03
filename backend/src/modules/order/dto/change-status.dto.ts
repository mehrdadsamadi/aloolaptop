import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ChangeToShippedDto {
  @ApiProperty()
  @IsString()
  trackingCode: string;
}

export class ChangeToCanceledOrRefundDto {
  @ApiProperty()
  @IsString()
  reason: string;
}
