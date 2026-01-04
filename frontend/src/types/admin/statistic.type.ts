import { LucideIcon } from 'lucide-react'

interface IChartData {
  month: string
  year: number
  count: number
}

export interface IChartStats {
  total: number
  growth: number
  chartData: IChartData[]
}

export interface IStats {
  title: string
  value: string
  change: string
  icon: LucideIcon
  trend: 'up' | 'down'
}
