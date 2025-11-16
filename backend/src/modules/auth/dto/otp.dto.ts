import { IsMobilePhone, IsString, Length } from 'class-validator';
import { AuthMessage } from '../../../common/enums/message.enum';
import { ApiProperty } from '@nestjs/swagger';

export class SendOtpDto {
  @ApiProperty()
  @IsMobilePhone('fa-IR', {}, { message: AuthMessage.InvalidMobile })
  mobile: string;
}

export class CheckOtpDto {
  @ApiProperty()
  @IsMobilePhone('fa-IR', {}, { message: AuthMessage.InvalidMobile })
  mobile: string;

  @ApiProperty()
  @IsString()
  @Length(5, 5, { message: AuthMessage.InvalidOtpCode })
  code: string;
}
