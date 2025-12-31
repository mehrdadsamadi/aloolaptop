// app/admin/components/sales-chart.tsx
'use client'

import { TrendingUp } from 'lucide-react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const data = [
  { month: 'فروردین', sales: 4000 },
  { month: 'اردیبهشت', sales: 3000 },
  { month: 'خرداد', sales: 5000 },
  { month: 'تیر', sales: 2780 },
  { month: 'مرداد', sales: 4890 },
  { month: 'شهریور', sales: 6000 },
]

export function SalesChart() {
  return (
    <div className="h-[300px]">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="h-4 w-4 text-green-500" />
        <span className="text-sm text-muted-foreground">رشد ۲۳٪ نسبت به ماه گذشته</span>
      </div>
      <ResponsiveContainer
        width="100%"
        height="90%"
        className={'dir-ltr'}
      >
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip formatter={(value) => [`${value} فروش`, 'تعداد']} />
          <Area
            type="monotone"
            dataKey="sales"
            stroke="#8884d8"
            fill="#8884d8"
            fillOpacity={0.3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
