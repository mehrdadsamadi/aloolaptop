import { LucideIcon } from 'lucide-react'

interface IChartData {
  month: string
  year: number
  value: number
}

export interface IChartStats {
  total: number
  growth: number | null
  chartData: IChartData[]
}

export interface IStats {
  key: string
  title: string
  value: string
  change: string
  icon: LucideIcon
  trend: 'up' | 'down'
}

export interface TopSellingProduct {
  productName: string
  totalSoldQuantity: number
  totalRevenue: number
  productId: string
}
