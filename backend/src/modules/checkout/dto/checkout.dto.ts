import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsMongoId, IsString } from 'class-validator';
import { VerifyStatus } from '../enums/verify-status.enum';

export class StartCheckoutDto {
  @ApiProperty()
  @IsMongoId({ each: true, message: 'آیدی آدرس معتبر نمیباشد' })
  addressId: string;
}

export class VerifyCheckoutDto {
  @ApiProperty()
  @IsString()
  authority: string;

  @ApiProperty({ enum: VerifyStatus })
  @IsEnum(VerifyStatus)
  status: VerifyStatus;
}
