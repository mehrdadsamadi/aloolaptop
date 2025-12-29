'use client'

import DataTable from '@/components/common/dataTable'
import { useEffect, useState } from 'react'
import { formatPersianDate, getFullName, getImageUrl } from '@/lib/utils'
import { ColumnDef } from '@tanstack/react-table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { ChevronDown } from 'lucide-react'
import { toast } from 'sonner'
import LoadingSection from '@/components/common/loadingSection'
import { useConfirm } from '@/hooks/useConfirm'
import NoData from '@/components/common/noData'
import { IOrder, OrderStatus } from '@/types/admin/order.type'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { ORDER_STATUS_CONSTANTS, PAYMENT_STATUS_CONSTANTS } from '@/lib/constants/order.constant'
import { changeOrderStatus, getOrdersList, IOrderMeta } from '@/actions/order.action'

// اضافه کردن transitions
const ORDER_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  [OrderStatus.AWAITING_PAYMENT]: [OrderStatus.CANCELED, OrderStatus.PAID],
  [OrderStatus.PAID]: [OrderStatus.PROCESSING, OrderStatus.REFUNDED],
  [OrderStatus.PROCESSING]: [OrderStatus.SHIPPED, OrderStatus.CANCELED],
  [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED],
  [OrderStatus.DELIVERED]: [], // نهایی است
  [OrderStatus.CANCELED]: [],
  [OrderStatus.REFUNDED]: [],
}

// تابع کمکی برای دریافت وضعیت‌های مجاز
const getAllowedStatuses = (currentStatus: OrderStatus): OrderStatus[] => {
  return ORDER_STATUS_TRANSITIONS[currentStatus] || []
}

interface AdminOrdersProps {
  status: OrderStatus
}

export default function AdminOrders({ status }: AdminOrdersProps) {
  const { confirm } = useConfirm()

  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [orders, setOrders] = useState<IOrder[] | null>(null)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)
  const [pagesCount, setPagesCount] = useState(1)

  const orderColumns: ColumnDef<IOrder>[] = [
    {
      accessorKey: 'firstName',
      header: 'کاربر',
      cell: ({ row }) => (
        <div className={'flex items-center gap-2'}>
          <Avatar>
            <AvatarImage src={getImageUrl(row.original?.userId?.profile?.avatar?.url)} />
            <AvatarFallback>AV</AvatarFallback>
          </Avatar>
          <div className={'flex flex-col gap-2'}>
            <p>{getFullName(row.original?.userId?.profile)}</p>
            <p>{row.original?.userId?.mobile}</p>
          </div>
        </div>
      ),
      enableSorting: true,
    },
    // {
    //   accessorKey: 'items',
    //   header: 'محصولات',
    //   cell: ({ row }) => row.original.profile?.lastName,
    //   enableSorting: true,
    // },
    {
      accessorKey: 'totalPrice',
      header: 'قیمت نهایی',
      cell: ({ row }) => (
        <Tooltip>
          <TooltipTrigger asChild>
            <p className={'cursor-default'}>{row.original?.totalPrice.toLocaleString()} تومان</p>
          </TooltipTrigger>
          <TooltipContent>
            <div className={'flex flex-col gap-3'}>
              <div className={'flex items-center justify-between gap-4'}>
                <p className={'text-right'}>قیمت کل محصولات :</p>
                <p className={'text-left'}>{row.original?.finalItemsPrice.toLocaleString()} تومان</p>
              </div>
              <div className={'flex items-center justify-between gap-4'}>
                <p className={'text-right'}>تخفیف :</p>
                <p className={'text-left'}>{row.original?.discountAmount.toLocaleString()} تومان</p>
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      ),
      enableSorting: true,
    },
    // {
    //   accessorKey: 'addressId',
    //   header: 'آدرس',
    //   cell: ({ row }) => row.original.addressId,
    //   enableSorting: true,
    // },
    {
      accessorKey: 'status',
      header: 'وضعیت سفارش',
      cell: ({ row }) => {
        const currentStatus = row.original?.status
        const allowedStatuses = getAllowedStatuses(currentStatus)

        // اگر وضعیتی مجاز برای تغییر وجود ندارد، فقط نمایش بده
        if (allowedStatuses.length === 0) {
          return (
            <Button
              size={'sm'}
              variant="outline"
              className={'text-xs cursor-default'}
              disabled
            >
              {ORDER_STATUS_CONSTANTS[currentStatus]}
            </Button>
          )
        }

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size={'sm'}
                variant="outline"
                className={'text-xs'}
                loading={loadingId === row.original._id}
              >
                {ORDER_STATUS_CONSTANTS[currentStatus]}
                <ChevronDown className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel dir={'rtl'}>وضعیت های سفارش</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={currentStatus}
                onValueChange={(value: string) => {
                  confirm({
                    title: 'تغییر وضعیت سفارش',
                    description: `آیا از تغییر وضعیت این سفارش به "${ORDER_STATUS_CONSTANTS[value as OrderStatus]}" مطمئن هستید؟`,
                    confirmText: 'بله، تغییر بده',
                    cancelText: 'لغو',
                    onConfirm: () => changeStatus(row.original._id, value as OrderStatus),
                  })
                }}
                className={'space-y-2'}
                dir={'rtl'}
              >
                {/* فقط وضعیت‌های مجاز را نمایش بده */}
                {allowedStatuses.map((status) => (
                  <DropdownMenuRadioItem
                    value={status}
                    key={status}
                    className={'cursor-pointer'}
                  >
                    {ORDER_STATUS_CONSTANTS[status]}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
    // {
    //   accessorKey: 'paymentStatus',
    //   header: 'وضعیت پرداخت',
    //   cell: ({ row }) => (
    //     <DropdownMenu>
    //       <DropdownMenuTrigger asChild>
    //         <Button
    //           size={'sm'}
    //           variant="outline"
    //           className={'text-xs'}
    //           loading={loadingId === row.original._id}
    //         >
    //           {PAYMENT_STATUS_CONSTANTS[row.original?.paymentStatus ?? PaymentStatus.PENDING]}
    //           <ChevronDown className="size-4" />
    //         </Button>
    //       </DropdownMenuTrigger>
    //       <DropdownMenuContent>
    //         <DropdownMenuLabel dir={'rtl'}>وضعیت های پرداخت</DropdownMenuLabel>
    //         <DropdownMenuSeparator />
    //         <DropdownMenuRadioGroup
    //           value={row.original?.paymentStatus}
    //           onValueChange={(value: string) => {
    //             confirm({
    //               title: 'تغییر وضعیت پرداخت',
    //               description: `آیا از تغییر وضعیت این پرداخت به "${PAYMENT_STATUS_CONSTANTS[value as PaymentStatus]}" مطمئن هستید؟`,
    //               confirmText: 'بله، تغییر بده',
    //               cancelText: 'لغو',
    //               onConfirm: () => changeRole(row.original._id, value as Roles),
    //             })
    //           }}
    //           className={'space-y-2'}
    //           dir={'rtl'}
    //         >
    //           {Object.entries(PAYMENT_STATUS_CONSTANTS).map(([key, value]) => (
    //             <DropdownMenuRadioItem
    //               value={key}
    //               key={key}
    //               className={'cursor-pointer'}
    //             >
    //               {value}
    //             </DropdownMenuRadioItem>
    //           ))}
    //         </DropdownMenuRadioGroup>
    //       </DropdownMenuContent>
    //     </DropdownMenu>
    //   ),
    // },
    {
      accessorKey: 'paymentStatus',
      header: 'وضعیت پرداخت',
      cell: ({ row }) => PAYMENT_STATUS_CONSTANTS[row.original?.paymentStatus],
      enableSorting: true,
    },
    {
      accessorKey: 'trackingCode',
      header: 'کد رهگیری',
      cell: ({ row }) => row.original?.trackingCode,
      enableSorting: true,
    },
    // {
    //   accessorKey: 'meta',
    //   header: 'اطلاعات پرداخت',
    //   cell: ({ row }) => row.original?.meta,
    //   enableSorting: true,
    // },
    {
      accessorKey: 'createdAt',
      header: 'تاریخ سفارش',
      cell: ({ row }) => formatPersianDate(row.original.createdAt),
      enableSorting: true,
    },
  ]

  const ordersList = async () => {
    const res = await getOrdersList({
      pagination: {
        page,
        limit,
      },
      status,
    })

    setOrders(res.orders)

    setPagesCount(res?.pagination?.pagesCount)
  }

  useEffect(() => {
    ordersList()
  }, [page, limit])

  const changeStatus = async (orderId: string, orderStats: OrderStatus, meta?: IOrderMeta) => {
    setLoadingId(orderId)

    const response = await changeOrderStatus(orderId, orderStats, meta)

    setOrders((prvOrder) => {
      if (!prvOrder || !response?.order) return prvOrder

      return prvOrder.filter((order) => order._id !== response?.order?._id)
    })

    toast.success(response.message)

    setLoadingId(null)
  }

  return (
    <>
      {orders === null ? (
        <LoadingSection />
      ) : orders?.length === 0 ? (
        <NoData />
      ) : (
        <DataTable
          columns={orderColumns}
          data={orders}
          page={page}
          pageLimit={limit}
          pagesCount={pagesCount}
          onPageChange={(page: number) => setPage(page)}
        />
      )}
    </>
  )
}
