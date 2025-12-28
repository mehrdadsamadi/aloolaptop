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
      code: code.toUpperCase().replace(/ /g, '_'),
      endDate,
      startDate,
      productIds,
      minOrderAmount: minOrderAmount || 0,
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
      .populate({ path: 'productIds', select: '_id name' });

    return {
      coupons,
      pagination: paginationGenerator(count, page, limit),
    };
  }

  async findById(id: string) {
    const coupon = await this.couponModel.findById(id);

    if (!coupon) throw new NotFoundException(CouponMessage.Notfound);

    return coupon;
  }

  async findByCode(code: string) {
    const coupon = await this.couponModel.findOne({ code: code.toUpperCase() });

    if (!coupon) throw new NotFoundException(CouponMessage.Notfound);

    return coupon;
  }

  async toggleActive(id: string) {
    const coupon = await this.findById(id);

    const message = coupon?.isActive
      ? CouponMessage.InActive
      : CouponMessage.Active;

    coupon.isActive = !coupon.isActive;
    await coupon.save();

    return {
      message,
      coupon,
    };
  }

  async increaseUsage(code: string) {
    return this.couponModel.updateOne(
      { code: code.toUpperCase() },
      { $inc: { usesCount: 1 } },
    );
  }
}
