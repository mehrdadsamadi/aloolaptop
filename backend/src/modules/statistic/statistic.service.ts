// statistics.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as moment from 'moment-jalaali';
import { User, UserDocument } from '../user/schemas/user.schema';
import {
  MonthlyStat,
  StatisticsOptions,
  StatisticsResult,
  TimestampedDocument,
} from './types/statistic.type';
import { Product, ProductDocument } from '../product/schema/product.schema';
import { Order, OrderDocument } from '../order/schema/order.schema';
import { PaymentStatus } from '../payment/enums/payment-status.enum';
import { Payment, PaymentDocument } from '../payment/schema/payment.schema';
import { OrderStatus } from '../order/enums/order-status.enum';
import { FilterTopSellingProductsDto } from '../../common/dtos/filter.dto';
import { TopSellingSortBy } from './enums/top-selling-sortBy.enum';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,

    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,

    @InjectModel(Order.name)
    private readonly orderModel: Model<OrderDocument>,

    @InjectModel(Payment.name)
    private readonly paymentModel: Model<PaymentDocument>,
  ) {}

  /**
   * Statistics مخصوص کاربران
   */
  async getUserStatistics() {
    return {
      users: await this.getStatistics(this.userModel),
    };
  }

  /**
   * Statistics مخصوص محصولات
   */
  async getProductStatistics() {
    return {
      products: await this.getStatistics(this.productModel, {
        isActive: true,
      }),
    };
  }

  /**
   * Statistics مخصوص سفارشات
   */
  async getOrderStatistics() {
    return {
      orders: await this.getStatistics(this.orderModel, {
        paymentStatus: PaymentStatus.PAID,
        status: { $ne: OrderStatus.CANCELED },
      }),
    };
  }

  /**
   * Statistics مخصوص فروش
   */
  async getPaymentStatistics() {
    return {
      payments: await this.getStatistics(
        this.paymentModel,
        {
          status: PaymentStatus.PAID,
        },
        {
          valueField: 'amount', // فیلدی که می‌خواهیم جمع آن را محاسبه کنیم
          operation: 'sum', // عملیات aggregation (sum, count, avg)
        },
      ),
    };
  }

  /**
   * متد عمومی و بهینه برای تمام مدل‌ها
   * @param model مدل مورد نظر
   * @param filter فیلترهای اضافی
   * @param options تنظیمات اختیاری برای نوع آمارگیری
   */
  async getStatistics<T extends TimestampedDocument>(
    model: Model<T>,
    filter: Record<string, any> = {},
    options: StatisticsOptions = {},
  ): Promise<StatisticsResult> {
    const {
      valueField = null, // فیلد مورد نظر برای جمع‌بندی (مثلاً 'amount')
      operation = 'count', // 'count', 'sum', 'avg'
      monthsCount = 6, // تعداد ماه‌های مورد نظر
    } = options;

    // بازه ماه‌های اخیر شمسی
    const end = moment().clone().endOf('jMonth');
    const start = moment()
      .clone()
      .subtract(monthsCount - 1, 'jMonth')
      .startOf('jMonth');

    // ایجاد pipeline بر اساس options
    const groupStage: any = {
      _id: {
        year: { $year: '$createdAt' },
        month: { $month: '$createdAt' },
      },
      count: { $sum: 1 },
    };

    // اگر valueField مشخص شده باشد، عملیات مربوطه را اضافه می‌کنیم
    if (valueField && operation !== 'count') {
      if (operation === 'sum') {
        groupStage.value = { $sum: `$${valueField}` };
      } else if (operation === 'avg') {
        groupStage.value = { $avg: `$${valueField}` };
      }
    } else {
      // اگر operation = 'count' یا valueField مشخص نشده باشد
      groupStage.value = { $sum: 1 };
    }

    const [totalResult, aggregated] = await Promise.all([
      // محاسبه کل بر اساس نوع عملیات
      model.aggregate([
        {
          $match: filter,
        },
        {
          $group: {
            _id: null,
            totalCount: { $sum: 1 },
            ...(valueField && {
              totalValue:
                operation === 'sum'
                  ? { $sum: `$${valueField}` }
                  : operation === 'avg'
                    ? { $avg: `$${valueField}` }
                    : undefined,
            }),
          },
        },
      ]),

      // aggregate برای محاسبه بر اساس ماه‌ها
      model.aggregate([
        {
          $match: {
            ...filter,
            createdAt: {
              $gte: start.toDate(),
              $lte: end.toDate(),
            },
          },
        },
        {
          $group: groupStage,
        },
        {
          $sort: {
            '_id.year': 1,
            '_id.month': 1,
          },
        },
      ]),
    ]);

    // استخراج نتایج total
    const totalData = totalResult[0] || {};
    const total = valueField
      ? totalData.totalValue || 0
      : totalData.totalCount || 0;

    /**
     * تولید لیست ماه‌های شمسی (حتی اگر دیتایی وجود نداشته باشد)
     */
    const months = Array.from({ length: monthsCount }).map((_, index) => {
      const m = moment()
        .clone()
        .subtract(monthsCount - 1 - index, 'jMonth');
      return {
        jYear: m.jYear(),
        jMonth: m.jMonth(),
        label: m.format('jMMMM'),
        gYear: m.year(),
        gMonth: m.month() + 1,
      };
    });

    // ایجاد chartData
    const chartData: MonthlyStat[] = months.map((m) => {
      const match = aggregated.find(
        (a) => a._id.year === m.gYear && a._id.month === m.gMonth,
      );

      return {
        month: m.label,
        year: m.jYear,
        value: match?.value ?? 0, // مقدار (count یا sum amount)
      };
    });

    /**
     * محاسبه رشد (growth)
     */
    const totalLastMonths = chartData.reduce(
      (sum, item) => sum + item.value,
      0,
    );

    const baseTotalBeforeRange = total - totalLastMonths;

    let cumulativePrev = baseTotalBeforeRange;
    let cumulativeCurrent = baseTotalBeforeRange;

    chartData.forEach((item, index) => {
      cumulativeCurrent += item.value;
      if (index === chartData.length - 2) {
        cumulativePrev = cumulativeCurrent;
      }
    });

    let growth: number | null = null;

    if (cumulativePrev > 0) {
      const growthValue =
        ((cumulativeCurrent - cumulativePrev) / cumulativePrev) * 100;
      growth = Number(growthValue.toFixed(2));
    }

    return {
      total,
      growth,
      chartData,
    };
  }

  async getTopSellingProducts(filterDto: FilterTopSellingProductsDto) {
    const { sortBy = TopSellingSortBy.REVENUE, limit = 10 } = filterDto;

    const sortField =
      sortBy === TopSellingSortBy.REVENUE
        ? 'totalRevenue'
        : 'totalSoldQuantity';

    const topSellingProducts = await this.orderModel.aggregate([
      // فقط سفارش‌های پرداخت‌شده واقعی
      {
        $match: {
          paymentStatus: 'paid',
          status: { $ne: 'canceled' },
        },
      },

      // باز کردن آیتم‌ها
      { $unwind: '$items' },

      // گروه‌بندی بر اساس محصول
      {
        $group: {
          _id: '$items.productId',

          productName: { $first: '$items.name' },

          totalSoldQuantity: {
            $sum: '$items.quantity',
          },

          totalRevenue: {
            $sum: '$items.totalPrice',
          },
        },
      },

      // 🔴 مرتب‌سازی بر اساس مبلغ فروش
      {
        $sort: {
          [sortField]: -1,
        },
      },

      // محدودسازی
      {
        $limit: limit,
      },

      // شکل خروجی مناسب پنل ادمین
      {
        $project: {
          _id: 0,
          productId: '$_id',
          productName: 1,
          totalSoldQuantity: 1,
          totalRevenue: 1,
        },
      },
    ]);

    return {
      products: topSellingProducts,
    };
  }

  /**
   * متد کمکی برای دریافت آمار بر اساس بازه زمانی دلخواه
   */
  async getStatisticsByDateRange<T extends TimestampedDocument>(
    model: Model<T>,
    startDate: Date,
    endDate: Date,
    filter: Record<string, any> = {},
    options: StatisticsOptions = {},
  ): Promise<StatisticsResult> {
    const fullFilter = {
      ...filter,
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    };

    return this.getStatistics(model, fullFilter, options);
  }
}
