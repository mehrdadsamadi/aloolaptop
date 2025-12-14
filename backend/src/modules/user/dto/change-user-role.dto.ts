import { IsEnum } from 'class-validator';
import { Roles } from '../../../common/enums/role.enum';
import { ApiProperty } from '@nestjs/swagger';

export class ChangeUserRoleDto {
  @ApiProperty({ enum: Roles })
  @IsEnum(Roles)
  role: Roles;
}
