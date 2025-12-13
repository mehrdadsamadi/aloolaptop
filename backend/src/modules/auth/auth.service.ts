import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../user/schemas/user.schema';
import { Model } from 'mongoose';
import { Otp, OtpDocument } from '../user/schemas/otp.schema';
import { CheckOtpDto, SendOtpDto } from './dto/otp.dto';
import { JwtService } from '@nestjs/jwt';
import { randomInt } from 'crypto';
import { ConfigService } from '@nestjs/config';
import { AuthMessage, UserMessage } from '../../common/enums/message.enum';
import axios from 'axios';
import { Roles } from '../../common/enums/role.enum';

interface TokensPayload {
  userId: string;
  mobile: string;
  role: Roles;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Otp.name) private readonly otpModel: Model<OtpDocument>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async sendOtp(otpDto: SendOtpDto) {
    const { mobile } = otpDto;

    let user = await this.userModel.findOne({ mobile });

    if (!user) {
      user = await this.userModel.create({
        mobile,
      });
    }

    const otp = await this.createOtp(user);

    await this.sendSms(mobile, otp.code);

    return {
      message: AuthMessage.SendOtp(mobile),
    };
  }

  async sendSms(mobile: string, code: string) {
    try {
      const url = 'https://api.sms.ir/v1/send/verify';
      const apiKey = this.configService.get<string>('SMS_API_KEY'); // API key را در env قرار بده
      const templateId = this.configService.get<string>('SMS_TEMPLATE_ID'); // Template ID از env

      const response = await axios.post(
        url,
        {
          mobile,
          templateId,
          parameters: [
            {
              name: 'CODE',
              value: code,
            },
          ],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'text/plain',
            'x-api-key': apiKey,
          },
        },
      );

      // بررسی پاسخ
      const data = response.data as { status: number };
      if (data.status !== 1) {
        throw new BadRequestException(AuthMessage.SendSmsFailed);
      }
    } catch (error) {
      console.error('SMS send error:', error);
      throw new BadRequestException(AuthMessage.SendSmsFailed);
    }
  }

  async checkOtp(otpDto: CheckOtpDto) {
    const { code, mobile } = otpDto;

    const user = await this.userModel
      .findOne({ mobile }) // فیلتر
      .populate('otp') // populate روی فیلد مرجع
      .exec();

    const now = new Date();

    if (!user) {
      throw new UnauthorizedException(AuthMessage.NotfoundMobile);
    }

    if (!user.otp) {
      throw new UnauthorizedException(AuthMessage.ExpireOtpCode);
    }

    const otp = user.otp;

    // اطمینان از نوع Date
    if (!(otp.expiresIn instanceof Date)) {
      otp.expiresIn = new Date(otp.expiresIn);
    }

    if (otp.expiresIn < now) {
      throw new UnauthorizedException(AuthMessage.ExpireOtpCode);
    }

    if (otp.code !== code) {
      throw new UnauthorizedException(AuthMessage.NotEqualOtpCode);
    }

    if (!user.mobileVerified) {
      // استفاده از _id و updateOne / findByIdAndUpdate
      await this.userModel.updateOne(
        { _id: user._id },
        { $set: { mobileVerified: true } },
      );
    }

    const { accessToken, refreshToken } = this.generateJwtTokens({
      userId: String(user._id),
      mobile,
      role: user.role,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(refreshToken: string) {
    try {
      // ابتدا token را با SECRET مخصوص refresh اعتبارسنجی کن
      const payload = this.jwtService.verify<TokensPayload>(refreshToken, {
        secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
      });

      // چک کن payload درست و شامل userId باشه
      if (!payload || typeof payload !== 'object' || !payload.userId) {
        throw new UnauthorizedException(AuthMessage.InvalidRefreshToken);
      }

      // از دیتابیس کاربر را بگیر (در صورت نیاز می‌تونی چک‌های اضافی مثل blocked/disabled بذاری)
      const user = await this.userModel.findById(payload.userId);
      if (!user) {
        throw new UnauthorizedException(UserMessage.Notfound);
      }

      // (اختیاری) اگر می‌خوای مطمئن بشی موبایل واریفاید شده:
      // if (!user.mobileVerified) throw new UnauthorizedException(AuthMessage.RequiredLogin);

      // تولید توکن‌های جدید
      return this.generateJwtTokens({
        userId: String(user._id),
        mobile: user.mobile,
        role: user.role,
      });
    } catch (error) {
      throw new UnauthorizedException(AuthMessage.InvalidRefreshToken);
    }
  }

  async createOtp(user: UserDocument) {
    const expiresIn = new Date(new Date().getTime() + 1000 * 60 * 2); // 2 دقیقه
    const code = randomInt(10000, 100000).toString(); // عدد 5 رقمی

    // دنبال otp موجود بگرد
    let otp = await this.otpModel.findOne({ userId: user._id }).exec();

    if (otp) {
      // اگر هنوز منقضی نشده، خطا بده
      if (otp.expiresIn > new Date()) {
        throw new BadRequestException(AuthMessage.NotExpireOtpCode);
      }

      // وگرنه مقدارها را به‌روز کن و ذخیره کن
      otp.code = code;
      otp.expiresIn = expiresIn;
      await otp.save();
    } else {
      // ایجاد سند جدید (از new استفاده کن تا Document صحیح برگرده)
      otp = new this.otpModel({
        code,
        expiresIn: expiresIn,
        userId: user._id,
      });
      await otp.save();
    }

    // ذخیره‌ی مرجع در کاربر
    user.otpId = otp._id;
    await user.save();

    return otp;
  }

  async validateAccessToken(token: string) {
    try {
      const payload = this.jwtService.verify<TokensPayload>(token, {
        secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
      });

      if (!payload || typeof payload !== 'object' || !payload.userId) {
        throw new UnauthorizedException(AuthMessage.RequiredLogin);
      }

      const user = await this.userModel.findById(payload.userId);
      if (!user) throw new UnauthorizedException(UserMessage.Notfound);

      return user;
    } catch {
      throw new UnauthorizedException(AuthMessage.RequiredLogin);
    }
  }

  generateJwtTokens(payload: TokensPayload) {
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
      expiresIn: '1h',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
      expiresIn: '1w',
    });

    return { accessToken, refreshToken };
  }
}
