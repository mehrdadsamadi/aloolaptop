import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Coupon, CouponDocument } from './schema/coupon.schema';
import { PaginationDto } from '../../common/dtos/pagination.dto';
import {
  paginationGenerator,
  paginationSolver,
} from '../../common/utils/pagination.util';
import { CouponMessage } from '../../common/enums/message.enum';
import { CreateCouponDto } from './dto/coupon.dto';
import { CouponType } from './enums/coupon-type.enum';
import { DiscountMethod } from './enums/discount-method.enum';

@Injectable()
export class CouponService {
  constructor(
    @InjectModel(Coupon.name)
    private readonly couponModel: Model<CouponDocument>,
  ) {}

  async create(createCouponDto: CreateCouponDto) {
    const {
      code,
      endDate,
      startDate,
      productIds,
      minOrderAmount,
      type,
      method,
      value,
      maxUses,
    } = createCouponDto;

    if (startDate >= endDate) {
      throw new BadRequestException(CouponMessage.Date);
    }

    if (
      type === CouponType.PRODUCT &&
      (!productIds || productIds.length === 0)
    ) {
      throw new BadRequestException(CouponMessage.ChoosProducts);
    }

    const coupon = await this.couponModel.create({
      code: code.toUpperCase(),
      endDate,
      startDate,
      productIds,
      minOrderAmount,
      type,
      method,
      value,
      maxUses,
    });

    return {
      message: CouponMessage.Created,
      coupon,
    };
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit, skip } = paginationSolver(paginationDto);

    const count = await this.couponModel.countDocuments();

    const coupons = await this.couponModel
      .find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return {
      coupons,
      pagination: paginationGenerator(count, page, limit),
    };
  }

  async findByCode(code: string) {
    const coupon = await this.couponModel.findOne({ code: code.toUpperCase() });

    if (!coupon) throw new NotFoundException(CouponMessage.Notfound);

    return coupon;
  }

  // TODO: این تابع بعد از تکمیل سبد خرید بررسی شود
  async validate(code: string, cartTotal: number, cartItems: any[]) {
    const coupon = await this.findByCode(code);

    if (!coupon || !coupon.isActive) {
      throw new BadRequestException('کد تخفیف معتبر نیست');
    }

    const now = new Date();
    if (coupon.startDate > now || coupon.endDate < now) {
      throw new BadRequestException('کد تخفیف منقضی شده است');
    }

    if (coupon.usesCount >= coupon.maxUses) {
      throw new BadRequestException('سقف استفاده از این کد تکمیل شده');
    }

    let discountAmount = 0;

    if (coupon.type === CouponType.CART) {
      if (cartTotal < (coupon.minOrderAmount || 0)) {
        throw new BadRequestException(
          'مبلغ سفارش کمتر از حداقل لازم برای این کد است',
        );
      }

      if (coupon.method === DiscountMethod.PERCENT) {
        discountAmount = (cartTotal * coupon.value) / 100;
      } else {
        discountAmount = coupon.value;
      }
    }

    if (
      coupon.type === CouponType.PRODUCT &&
      coupon.productIds &&
      coupon.productIds.length > 0
    ) {
      const validProducts = cartItems.filter((item) =>
        coupon.productIds!.includes(item.productId.toString()),
      );

      if (validProducts.length === 0) {
        throw new BadRequestException(
          'این کد روی محصولات انتخابی شما اعمال نمی‌شود',
        );
      }

      validProducts.forEach((item) => {
        if (coupon.method === DiscountMethod.PERCENT) {
          discountAmount += ((item.price * coupon.value) / 100) * item.quantity;
        } else {
          discountAmount += coupon.value * item.quantity;
        }
      });
    }

    return {
      coupon,
      discountAmount,
      finalAmount: cartTotal - discountAmount,
    };
  }

  // TODO: بعد از پرداخت موفق یکی اضافه بشه
  async increaseUsage(code: string) {
    return this.couponModel.updateOne(
      { code: code.toUpperCase() },
      { $inc: { usesCount: 1 } },
    );
  }
}
