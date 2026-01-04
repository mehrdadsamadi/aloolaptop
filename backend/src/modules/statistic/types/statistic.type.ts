import { Document } from 'mongoose';

export interface StatisticsResult {
  total: number;
  growth: number | null;
  chartData: MonthlyStat[];
}

export interface MonthlyStat {
  month: string;
  year: number;
  count: number;
}

export type TimestampedDocument = Document & {
  createdAt: Date;
  updatedAt: Date;
};
