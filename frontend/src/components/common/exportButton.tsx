'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { OrderStatus } from '@/types/admin/order.type'
import { toast } from 'sonner'
import { getExportData } from '@/actions/helpers/fetchClient'

type ExportFormat = 'excel' | 'csv' | 'pdf'

interface ExportButtonProps {
  status: OrderStatus
  filters?: {
    startDate?: string
    endDate?: string
    search?: string
  }
}

export function ExportButton({ status, filters = {} }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async (format: ExportFormat) => {
    setIsExporting(true)

    try {
      // ساخت query parameters
      const params = new URLSearchParams({
        format,
        status,
        ...filters,
      })

      // ارسال درخواست به NestJS
      const blob = await getExportData(`/api/orders/export?${params?.toString()}`)

      if (!blob) {
        throw new Error('خطا در دریافت خروجی')
      }

      // دریافت blob و ایجاد لینک دانلود
      const url = window.URL.createObjectURL(blob)

      const link = document.createElement('a')

      // تعیین نام فایل بر اساس فرمت
      const filename = `orders-${status}-${new Date().toISOString().split('T')[0]}.${format}`

      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast.success('خروجی با موفقیت تولید شد', {
        description: `فایل ${filename} دانلود شد`,
      })
    } catch (error: any) {
      toast.error('خطا در تولید خروجی', {
        description: error?.message,
      })
      console.error('Export error:', error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          disabled={isExporting}
          className="flex items-center gap-2"
        >
          {isExporting ? (
            <>
              <span className="animate-spin">⟳</span>
              در حال تولید...
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              خروجی گزارش
            </>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        dir={'rtl'}
        align="start"
      >
        <DropdownMenuItem
          className={'cursor-pointer'}
          onClick={() => handleExport('excel')}
        >
          <span className="ml-2">📊</span>
          خروجی Excel
        </DropdownMenuItem>

        <DropdownMenuItem
          className={'cursor-pointer'}
          onClick={() => handleExport('csv')}
        >
          <span className="ml-2">📄</span>
          خروجی CSV
        </DropdownMenuItem>

        <DropdownMenuItem
          className={'cursor-pointer'}
          onClick={() => handleExport('pdf')}
        >
          <span className="ml-2">📋</span>
          خروجی PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
