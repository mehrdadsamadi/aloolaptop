import { Document } from 'mongoose';

export interface StatisticsResult {
  total: number;
  growth: number | null;
  chartData: MonthlyStat[];
}

export interface MonthlyStat {
  month: string;
  year: number;
  value: number;
}

export type TimestampedDocument = Document & {
  createdAt: Date;
  updatedAt: Date;
};

export interface StatisticsOptions {
  valueField?: string; // فیلدی که می‌خواهیم روی آن عملیات انجام دهیم (مثلاً 'amount')
  operation?: 'count' | 'sum' | 'avg'; // نوع عملیات
  monthsCount?: number; // تعداد ماه‌های مورد نظر
}
