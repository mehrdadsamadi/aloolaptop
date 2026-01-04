// app/admin/components/user-growth-chart.tsx
'use client'

import { TrendingDown, TrendingUp } from 'lucide-react'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useEffect, useState } from 'react'
import { IChartStats } from '@/types/admin/statistic.type'

interface Props {
  data: IChartStats | null
  title: string
  icon: React.ReactNode
  totalPostfix?: string
}

const LINE_COLOR = '#3B82F6'
const GRID_COLOR = '#E5E7EB'

export function GrowthChart({ data, title, icon, totalPostfix = '' }: Props) {
  const [formattedData, setFormattedData] = useState<
    Array<{
      month: string
      value: number
      growth: number
      displayMonth: string
      shortMonth: string
    }>
  >([])

  const [maxValue, setMaxValue] = useState(0)
  const [averageGrowth, setAverageGrowth] = useState(0)

  useEffect(() => {
    if (data?.chartData) {
      // تبدیل داده‌ها به فرمت مورد نیاز برای نمودار
      const formatted = data.chartData.map((item, index) => {
        // محاسبه رشد ماهانه
        let monthlyGrowth = 0
        if (index > 0) {
          const prevCount = data.chartData[index - 1].value
          if (prevCount > 0) {
            monthlyGrowth = ((item.value - prevCount) / prevCount) * 100
          } else if (item.value > 0) {
            monthlyGrowth = 100
          }
        }

        // نام ماه به فارسی
        const persianMonths: { [key: string]: string } = {
          Farvardin: 'فروردین',
          Ordibehesht: 'اردیبهشت',
          Khordad: 'خرداد',
          Tir: 'تیر',
          Mordad: 'مرداد',
          Shahrivar: 'شهریور',
          Mehr: 'مهر',
          Aban: 'آبان',
          Azar: 'آذر',
          Dey: 'دی',
          Bahman: 'بهمن',
          Esfand: 'اسفند',
          Amordaad: 'مرداد',
          Aabaan: 'آبان',
          Aazar: 'آذر',
        }

        const displayMonth = persianMonths[item.month] || item.month

        return {
          month: item.month,
          displayMonth: `${displayMonth} ${item.year}`,
          shortMonth: displayMonth,
          value: item.value,
          growth: parseFloat(monthlyGrowth.toFixed(1)),
        }
      })

      setFormattedData(formatted)

      // پیدا کردن بیشترین مقدار برای تنظیم YAxis
      const max = Math.max(...formatted.map((item) => item.value))
      setMaxValue(max)

      // محاسبه میانگین رشد ماهانه (به جز ماه اول)
      if (formatted.length > 1) {
        const growthValues = formatted.slice(1).map((item) => item.growth)
        const validGrowths = growthValues.filter((g) => !isNaN(g) && isFinite(g))
        if (validGrowths.length > 0) {
          const avg = validGrowths.reduce((a, b) => a + b, 0) / validGrowths.length
          setAverageGrowth(parseFloat(avg.toFixed(1)))
        }
      }
    }
  }, [data])

  if (!data) {
    return (
      <div className="h-[400px] bg-white rounded-lg border p-6 shadow-sm flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  // Custom Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200 min-w-[200px]">
          <p className="font-semibold text-gray-800 mb-2 text-right">{label}</p>
          <div className="space-y-1 text-right">
            <div className="flex items-center justify-between flex-row-reverse">
              <span className="text-blue-600 font-medium">:{title}</span>
              <span
                className="font-bold text-gray-800"
                dir={'rtl'}
              >
                {payload[0].value.toLocaleString()} {totalPostfix}
              </span>
            </div>
            {payload[1] && (
              <div className="flex items-center justify-between">
                <span className={payload[1].value >= 0 ? 'text-green-600' : 'text-red-600'}>رشد:</span>
                <span className={`font-medium ${payload[1].value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {payload[1].value >= 0 ? '+' : ''}
                  {payload[1].value}%
                </span>
              </div>
            )}
          </div>
        </div>
      )
    }
    return null
  }

  // Custom Legend
  const renderLegend = () => (
    <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t">
      {formattedData.map((item, index) => (
        <div
          key={index}
          className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <span className="text-sm text-gray-700 font-medium">{item.shortMonth}:</span>
            <span className="text-sm text-gray-600">
              {item.value.toLocaleString()} {totalPostfix}
            </span>
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <div className="bg-white rounded-lg border p-6 shadow-sm">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div className="flex items-center gap-3 mb-4 md:mb-0">
          <div className="p-2 rounded-lg bg-blue-50">{icon}</div>
          <div>
            <h3 className="font-semibold text-lg">{title}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-gray-500">کل {title}:</span>
              <span className="text-2xl font-bold text-gray-800">
                {data.total.toLocaleString()} {totalPostfix}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          {data?.growth !== null && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                {data?.growth >= 0 ? <TrendingUp className="h-5 w-5 text-green-500" /> : <TrendingDown className="h-5 w-5 text-red-500" />}
                <div>
                  <div className="text-sm text-gray-500">رشد ماهانه</div>
                  <div className={`text-lg font-bold ${data?.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {data?.growth >= 0 ? '+' : ''}
                    {data?.growth}%
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              <div>
                <div className="text-sm text-gray-500">میانگین رشد</div>
                <div className={`text-lg font-bold ${averageGrowth >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                  {averageGrowth >= 0 ? '+' : ''}
                  {averageGrowth}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="h-[300px] mb-6">
        <ResponsiveContainer
          width="100%"
          height="100%"
          className={'dir-ltr'}
        >
          <LineChart
            data={formattedData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid
              stroke={GRID_COLOR}
              strokeDasharray="3 3"
              vertical={false}
            />
            <XAxis
              dataKey="shortMonth"
              axisLine={false}
              tickLine={false}
              tickMargin={10}
              fontSize={12}
              tick={{ fill: '#6B7280' }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickMargin={10}
              fontSize={12}
              width={60}
              tick={{ fill: '#6B7280' }}
              tickFormatter={(value) => value.toLocaleString()}
              domain={[0, Math.ceil(maxValue * 1.1)]} // 10% فضای اضافه
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="value"
              stroke={LINE_COLOR}
              strokeWidth={3}
              dot={{
                r: 6,
                fill: LINE_COLOR,
                stroke: '#FFFFFF',
                strokeWidth: 2,
              }}
              activeDot={{
                r: 8,
                fill: LINE_COLOR,
                stroke: '#FFFFFF',
                strokeWidth: 3,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Legend - داخل کارت و مرتب شده */}
      {renderLegend()}
    </div>
  )
}
