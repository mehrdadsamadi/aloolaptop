import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  ParseFilePipe,
  Patch,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { UserService } from '../services/user.service';
import { AuthDecorator } from '../../../common/decorators/auth.decorator';
import { UpdateProfileDto } from '../dto/user-profile.dto';
import { SwaggerConsumes } from '../../../common/enums/swagger-consumes.enum';
import { SendOtpDto } from '../../auth/dto/otp.dto';
import { UploadFileS3 } from '../../../common/interceptors/upload-file.interceptor';

@Controller('user')
@ApiTags('User')
@AuthDecorator()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  async getMe() {
    return this.userService.getMe();
  }

  @Patch('profile')
  @ApiConsumes(SwaggerConsumes.Multipart)
  @UseInterceptors(UploadFileS3('avatar'))
  async updateProfile(
    @Body() updateProfileDto: UpdateProfileDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 10 }),
          new FileTypeValidator({ fileType: 'image/(png|jpeg|jpg|webp)' }),
        ],
        fileIsRequired: false,
      }),
    )
    avatar: Express.Multer.File,
  ) {
    return this.userService.updateProfile(updateProfileDto, avatar);
  }

  @Patch('change-mobile')
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  async changeMobile(@Body() sendOtpDto: SendOtpDto) {
    return this.userService.changeMobile(sendOtpDto);
  }
}
