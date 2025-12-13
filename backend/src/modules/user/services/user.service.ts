import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { Otp, OtpDocument } from '../schemas/otp.schema';
import { AuthMessage, UserMessage } from '../../../common/enums/message.enum';
import { UpdateProfileDto } from '../dto/user-profile.dto';
import { SendOtpDto } from '../../auth/dto/otp.dto';
import { AuthService } from '../../auth/auth.service';
import { S3Service } from '../../common/services/s3/s3.service';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import {
  paginationGenerator,
  paginationSolver,
} from '../../../common/utils/pagination.util';
import { PaginationDto } from '../../../common/dtos/pagination.dto';

@Injectable({ scope: Scope.REQUEST })
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Otp.name) private otpModel: Model<OtpDocument>,

    @Inject(REQUEST) private req: Request,

    private readonly authService: AuthService,
    private readonly s3Service: S3Service,
  ) {}

  async usersList(paginationDto: PaginationDto) {
    const { page, limit, skip } = paginationSolver(paginationDto);

    const count = await this.userModel.countDocuments();

    const users = await this.userModel
      .find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return {
      users,
      pagination: paginationGenerator(count, page, limit),
    };
  }

  async getMe() {
    const userId = this.req.user?._id;

    const user = await this.userModel.findById(userId);
    // .populate('otp')
    // .populate('addresses')
    // .populate('reviews');

    if (!user) throw new NotFoundException(UserMessage.Notfound);

    return user;
  }

  async updateProfile(
    updateProfileDto: UpdateProfileDto,
    avatar: Express.Multer.File,
  ) {
    const userId = this.req.user?._id;

    const { firstName, lastName } = updateProfileDto;

    let url: string | undefined = undefined;
    let key: string | undefined = undefined;

    if (avatar) {
      const uploaded = await this.s3Service.uploadFile(avatar, 'avatars');
      url = uploaded.url;
      key = uploaded.key;
    }

    const user = await this.userModel.findByIdAndUpdate(
      userId,
      {
        $set: {
          'profile.firstName': firstName,
          'profile.lastName': lastName,
          ...(avatar && {
            'profile.avatar': { url, key },
          }),
        },
      },
      { new: true },
    );

    if (!user) throw new NotFoundException(UserMessage.Notfound);

    return { message: UserMessage.ProfileUpdated, user };
  }

  async changeMobile(sendOtpDto: SendOtpDto) {
    const userId = this.req.user?._id;

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
