import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { Otp, OtpDocument } from '../schemas/otp.schema';
import { AuthMessage, UserMessage } from '../../../common/enums/message.enum';
import { UpdateProfileDto } from '../dto/user-profile.dto';
import { SendOtpDto } from '../../auth/dto/otp.dto';
import { AuthService } from '../../auth/auth.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Otp.name) private otpModel: Model<OtpDocument>,

    private readonly authService: AuthService,
  ) {}

  async getMe(userId: string) {
    const user = await this.userModel
      .findById(userId)
      .populate('addresses')
      .populate('reviews');

    if (!user) throw new NotFoundException(UserMessage.Notfound);

    return user;
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    // TODO: fix upload avatar
    const { firstName, lastName, avatar } = updateProfileDto;

    const user = await this.userModel.findByIdAndUpdate(
      userId,
      { profile: { firstName, lastName, avatar } },
      { new: true },
    );

    if (!user) throw new NotFoundException(UserMessage.Notfound);

    return { message: UserMessage.ProfileUpdated, user };
  }

  async changeMobile(userId: string, sendOtpDto: SendOtpDto) {
    const { mobile } = sendOtpDto;

    const exists = await this.userModel.findOne({ mobile: mobile });
    if (exists) throw new BadRequestException(AuthMessage.DuplicateMobile);

    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException(UserMessage.Notfound);

    user.mobile = mobile;
    user.mobileVerified = false;

    const otp = await this.authService.createOtp(user);

    await this.authService.sendSms(mobile, otp.code);

    return {
      message: AuthMessage.SendOtp(mobile),
    };
  }
}
