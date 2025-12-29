'use client'

import { useEffect, useState } from 'react'
import LoadingSection from '@/components/common/loadingSection'
import NoData from '@/components/common/noData'
import DataTable from '@/components/common/dataTable'
import { ColumnDef } from '@tanstack/react-table'
import { formatPersianDate } from '@/lib/utils'
import { CircleCheckIcon, CircleSlashIcon, Ellipsis } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useConfirm } from '@/hooks/useConfirm'
import { CouponType, ICoupon } from '@/types/admin/coupon.type'
import { getCouponsList, toggleActiveCoupon } from '@/actions/coupon.action'
import { DISCOUNT_METHOD_CONSTANTS } from '@/lib/constants/coupon.constant'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function AdminCoupons() {
  const { confirm } = useConfirm()

  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [coupons, setCoupons] = useState<ICoupon[] | null>(null)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)
  const [pagesCount, setPagesCount] = useState(1)

  const couponColumns: ColumnDef<ICoupon>[] = [
    {
      accessorKey: 'code',
      header: 'کد',
      cell: ({ row }) => row.original?.code,
      enableSorting: true,
    },
    {
      accessorKey: 'type',
      header: 'نوع',
      cell: ({ row }) =>
        row.original?.type === CouponType.CART ? (
          'سبد خرید'
        ) : (
          <div className={'flex items-center gap-2'}>
            محصول
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="cursor-pointer p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                  <Ellipsis className="h-4 w-4 text-gray-500" />
                </div>
              </TooltipTrigger>
              <TooltipContent
                side="bottom"
                align="start"
                className="w-64 max-h-80 overflow-y-auto"
              >
                <div className="flex flex-col gap-3">
                  <p className="text-xs">محصولات:</p>
                  <hr />
                  {row.original?.productIds?.map((item) => (
                    <p key={item?._id}>{item?.name}</p>
                  ))}
                </div>
              </TooltipContent>
            </Tooltip>
          </div>
        ),
      enableSorting: true,
    },
    {
      accessorKey: 'method',
      header: 'تخفیف',
      cell: ({ row }) => (
        <p>
          {row.original?.value?.toLocaleString()} {DISCOUNT_METHOD_CONSTANTS[row.original?.method]}
        </p>
      ),
      enableSorting: true,
    },
    {
      accessorKey: 'minOrderAmount',
      header: 'حداقل تعداد سفارش',
      cell: ({ row }) => (row.original?.minOrderAmount === 0 ? 'بدون محدودیت' : row.original?.minOrderAmount),
      enableSorting: true,
    },
    {
      accessorKey: 'usesCount',
      header: 'تعداد استفاده',
      cell: ({ row }) => (
        <p
          dir={'ltr'}
          className={'text-right'}
        >
          {row.original?.usesCount} / {row.original?.maxUses}
        </p>
      ),
      enableSorting: true,
    },
    {
      accessorKey: 'isActive',
      header: 'وضعیت',
      cell: ({ row }) => (
        <div className={'flex items-center gap-2'}>
          <Badge variant={row.original?.isActive ? 'default' : 'destructive'}>{row.original?.isActive ? 'فعال' : 'غیر فعال'}</Badge>

          <Button
            size={'icon'}
            variant={'secondary'}
            loading={loadingId === row.original._id}
            onClick={() => {
              confirm({
                title: row.original?.isActive ? 'غیر فعال' : 'فعال',
                description: `آیا از ${row.original?.isActive ? 'غیر فعال' : 'فعال'} کردن کوپن مطمعن هستید؟`,
                confirmText: 'بله',
                cancelText: 'لغو',
                onConfirm: () => toggleActive(row.original._id),
              })
            }}
          >
            {row.original?.isActive ? (
              <CircleCheckIcon className={'text-green-500 size-6'} />
            ) : (
              <CircleSlashIcon className={'text-red-500 size-6'} />
            )}
          </Button>
        </div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: 'startDate',
      header: 'تاریخ شروع',
      cell: ({ row }) => formatPersianDate(row.original.startDate),
      enableSorting: true,
    },
    {
      accessorKey: 'endDate',
      header: 'تاریخ پایان',
      cell: ({ row }) => formatPersianDate(row.original.endDate),
      enableSorting: true,
    },
  ]

  const couponList = async () => {
    const res = await getCouponsList({
      page,
      limit,
    })

    setCoupons(res.coupons)

    setPagesCount(res?.pagination?.pagesCount)
  }

  useEffect(() => {
    couponList()
  }, [page, limit])

  const toggleActive = async (couponId: string) => {
    setLoadingId(couponId)

    const response = await toggleActiveCoupon(couponId)

    if (response?.ok === false) {
      toast.error(response.message)
      return
    }

    setCoupons((prev) => {
      if (!prev) return prev

      return prev.map((cpn) => (cpn._id === couponId ? { ...cpn, isActive: !cpn.isActive } : cpn))
    })

    toast.success(response.message)

    setLoadingId(null)
  }

  return (
    <>
      {coupons === null ? (
        <LoadingSection />
      ) : coupons?.length === 0 ? (
        <NoData />
      ) : (
        <DataTable
          columns={couponColumns}
          data={coupons}
          page={page}
          pageLimit={limit}
          pagesCount={pagesCount}
          onPageChange={(page: number) => setPage(page)}
        />
      )}
    </>
  )
}
