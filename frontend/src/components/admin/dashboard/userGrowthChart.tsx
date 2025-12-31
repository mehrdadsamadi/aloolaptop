// app/admin/components/user-growth-chart.tsx
'use client'

import { TrendingUp, Users } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const data = [
  { month: 'فروردین', users: 1250, growth: 12 },
  { month: 'اردیبهشت', users: 1890, growth: 15 },
  { month: 'خرداد', users: 2450, growth: 18 },
  { month: 'تیر', users: 3120, growth: 21 },
  { month: 'مرداد', users: 3980, growth: 25 },
  { month: 'شهریور', users: 4850, growth: 28 },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']

export function UserGrowthChart() {
  return (
    <div className="h-[300px]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-blue-500" />
          <h3 className="font-semibold">رشد کاربران</h3>
        </div>
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-green-500" />
          <span className="text-sm text-muted-foreground">
            میانگین رشد ماهانه: <span className="font-bold text-green-600">۱۹.۸٪</span>
          </span>
        </div>
      </div>

      <ResponsiveContainer
        width="100%"
        height="90%"
        className={'dir-ltr'}
      >
        <BarChart data={data}>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
          />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => `${value / 1000}k`}
          />
          <Tooltip
            formatter={(value, name) => {
              if (name === 'users') return [`${value} کاربر`, 'تعداد']
              if (name === 'growth') return [`${value}%`, 'رشد']
              return [value, name]
            }}
            labelFormatter={(label) => `ماه: ${label}`}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              textAlign: 'right',
              direction: 'rtl',
            }}
          />
          <Bar
            dataKey="users"
            name="کاربران"
            radius={[4, 4, 0, 0]}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
