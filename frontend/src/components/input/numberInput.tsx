// components/ui/number-input.tsx
import * as React from 'react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface NumberInputProps extends Omit<React.ComponentProps<'input'>, 'value' | 'onChange' | 'type'> {
  value?: number | null
  onChange?: (value: number | null) => void
  format?: boolean
  type?: 'text' | 'tel' // محدود کردن type به مقادیر مجاز
}

const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  ({ className, type = 'text', value, onChange, format = true, ...props }, ref) => {
    // تابع برای فرمت کردن عدد با جداکننده هزارگان
    const formatNumber = (num: number | null): string => {
      if (num === null || num === undefined || num === 0) return ''
      if (!format) return num.toString()
      return new Intl.NumberFormat('en-US').format(num)
    }

    // تابع برای پارس کردن مقدار ورودی
    const parseNumber = (str: string): number | null => {
      const cleaned = str.replace(/,/g, '')
      if (cleaned === '') return null
      const num = parseInt(cleaned, 10)
      return isNaN(num) ? null : num
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        const parsedValue = parseNumber(e.target.value)
        onChange(parsedValue)
      }
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      // هنگام خارج شدن از فوکوس، عدد را فرمت می‌کنیم
      if (format && e.target.value) {
        const parsedValue = parseNumber(e.target.value)
        if (parsedValue !== null) {
          e.target.value = formatNumber(parsedValue)
        }
      }
    }

    const inputValue = format ? formatNumber(value ?? null) : (value?.toString() ?? '')

    return (
      <Input
        ref={ref}
        type="text"
        inputMode="numeric"
        value={inputValue}
        onChange={handleChange}
        onBlur={handleBlur}
        className={cn('', className)}
        {...props}
      />
    )
  }
)

NumberInput.displayName = 'NumberInput'

export { NumberInput }
