import { Body, Controller, Get, Patch } from '@nestjs/common';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { UserService } from '../services/user.service';
import { AuthDecorator } from '../../../common/decorators/auth.decorator';
import { UserReq } from '../../../common/decorators/user.decorator';
import { IUserRequestType } from '../../../common/types/request.type';
import { UpdateProfileDto } from '../dto/user-profile.dto';
import { SwaggerConsumes } from '../../../common/enums/swagger-consumes.enum';
import { SendOtpDto } from '../../auth/dto/otp.dto';

@Controller('user')
@ApiTags('User')
@AuthDecorator()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  async getMe(@UserReq() userReq: IUserRequestType) {
    return this.userService.getMe(String(userReq._id));
  }

  // TODO: fix upload avatar
  @Patch('profile')
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  async updateProfile(
    @UserReq() userReq: IUserRequestType,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.userService.updateProfile(
      String(userReq._id),
      updateProfileDto,
    );
  }

  @Patch('change-mobile')
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  async changeMobile(
    @UserReq() userReq: IUserRequestType,
    @Body() sendOtpDto: SendOtpDto,
  ) {
    return this.userService.changeMobile(String(userReq._id), sendOtpDto);
  }
}
