// statistics.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as moment from 'moment-jalaali';
import { User, UserDocument } from '../user/schemas/user.schema';
import {
  MonthlyStat,
  StatisticsResult,
  TimestampedDocument,
} from './types/statistic.type';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
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
   * متد عمومی و بهینه برای تمام مدل‌هایی که createdAt دارند
   */
  async getStatistics<T extends TimestampedDocument>(
    model: Model<T>,
  ): Promise<StatisticsResult> {
    // بازه ۶ ماه اخیر شمسی
    const end = moment().clone().endOf('jMonth');
    const start = moment().clone().subtract(5, 'jMonth').startOf('jMonth');

    const [total, aggregated] = await Promise.all([
      model.countDocuments(),
      model.aggregate([
        {
          $match: {
            createdAt: {
              $gte: start.toDate(),
              $lte: end.toDate(),
            },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
            },
            count: { $sum: 1 },
          },
        },
        {
          $sort: {
            '_id.year': 1,
            '_id.month': 1,
          },
        },
      ]),
    ]);

    /**
     * تولید لیست ۶ ماه شمسی (حتی اگر دیتایی وجود نداشته باشد)
     */
    const months = Array.from({ length: 6 }).map((_, index) => {
      const m = moment()
        .clone()
        .subtract(5 - index, 'jMonth');
      return {
        jYear: m.jYear(),
        jMonth: m.jMonth(),
        label: m.format('jMMMM'),
        gYear: m.year(),
        gMonth: m.month() + 1,
      };
    });

    const chartData: MonthlyStat[] = months.map((m) => {
      const match = aggregated.find(
        (a) => a._id.year === m.gYear && a._id.month === m.gMonth,
      );

      return {
        month: m.label,
        year: m.jYear,
        count: match?.count ?? 0,
      };
    });

    /**
     * محاسبه رشد
     */
    const current = chartData[chartData.length - 1]?.count ?? 0;
    const previous = chartData[chartData.length - 2]?.count ?? 0;

    let growth: number | null = null;

    if (previous > 0) {
      growth = Number((((current - previous) / previous) * 100).toFixed(2));
    } else if (previous === 0 && current > 0) {
      growth = 100;
    }

    return {
      total,
      growth,
      chartData,
    };
  }
}
