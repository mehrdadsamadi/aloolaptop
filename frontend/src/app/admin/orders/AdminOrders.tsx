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
import { ChevronDown, ChevronLeftIcon, CreditCardIcon, HistoryIcon, MapPinIcon } from 'lucide-react'
import { toast } from 'sonner'
import LoadingSection from '@/components/common/loadingSection'
import { useConfirm } from '@/hooks/useConfirm'
import NoData from '@/components/common/noData'
import { AddressId, HistoryMeta, IOrder, Item, Meta, OrderStatus } from '@/types/admin/order.type'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { ORDER_STATUS_CONSTANTS, PAYMENT_STATUS_CONSTANTS } from '@/lib/constants/order.constant'
import { changeOrderStatus, getOrdersList } from '@/actions/order.action'
import ReasonDialog from '@/app/admin/orders/_components/ReasonDialog'
import TrackingCodeDialog from '@/app/admin/orders/_components/TrackingCodeDialog'
import { Badge } from '@/components/ui/badge'
import OrderItemsDialog from '@/app/admin/orders/_components/OrderItemsDialog'
import AddressDialog from '@/app/admin/orders/_components/AddressDialog'
import MetaInfoDialog from '@/app/admin/orders/_components/MetaInfoDialog'

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

// تابع کمکی برای بررسی نیاز به دلیل
const requiresReason = (newStatus: OrderStatus): boolean => {
  return newStatus === OrderStatus.CANCELED || newStatus === OrderStatus.REFUNDED
}

// تابع کمکی برای بررسی نیاز به کد رهگیری
const requiresTrackingCode = (newStatus: OrderStatus): boolean => {
  return newStatus === OrderStatus.SHIPPED
}

// تابع کمکی برای گرفتن متن مناسب برای دیالوگ
const getReasonDialogConfig = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.CANCELED:
      return {
        title: 'لغو سفارش',
        label: 'دلیل لغو *',
        placeholder: 'لطفاً دلیل لغو سفارش را وارد کنید...',
        confirmText: 'تأیید لغو',
      }
    case OrderStatus.REFUNDED:
      return {
        title: 'بازپرداخت وجه',
        label: 'دلیل بازپرداخت *',
        placeholder: 'لطفاً دلیل بازپرداخت وجه را وارد کنید...',
        confirmText: 'تأیید بازپرداخت',
      }
    default:
      return {
        title: 'دلیل',
        label: 'دلیل *',
        placeholder: 'لطفاً دلیل را وارد کنید...',
        confirmText: 'تایید',
      }
  }
}

interface AdminOrdersProps {
  status: OrderStatus
}

export default function AdminOrders({ status }: AdminOrdersProps) {
  const { confirm } = useConfirm()

  // State برای مدیریت دیالوگ
  const [reasonDialogState, setReasonDialogState] = useState({
    open: false,
    orderId: '',
    newStatus: '' as OrderStatus,
    config: getReasonDialogConfig(OrderStatus.CANCELED),
  })

  // State برای مدیریت دیالوگ کد رهگیری
  const [trackingCodeDialogState, setTrackingCodeDialogState] = useState({
    open: false,
    orderId: '',
    newStatus: '' as OrderStatus,
  })

  const [itemsDialogState, setItemsDialogState] = useState<{
    open: boolean
    items: Item[]
  }>({
    open: false,
    items: [],
  })

  const [addressDialogState, setAddressDialogState] = useState<{
    open: boolean
    address: AddressId | null
  }>({
    open: false,
    address: null,
  })

  const [metaDialogState, setMetaDialogState] = useState<{
    open: boolean
    meta: Meta | null
  }>({
    open: false,
    meta: null,
  })

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
          <div className={'flex flex-col'}>
            <p>{getFullName(row.original?.userId?.profile)}</p>
            <p className={'text-xs'}>{row.original?.userId?.mobile}</p>
          </div>
        </div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: 'items',
      header: 'محصولات',
      cell: ({ row }) => {
        const items: Item[] = row.original.items || []
        const totalItems = items.length
        const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0)

        return (
          <div
            className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/30 cursor-pointer transition-colors group"
            onClick={() =>
              setItemsDialogState({
                open: true,
                items: items,
              })
            }
          >
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="text-xs"
                  >
                    {totalItems} محصول
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="text-xs"
                  >
                    {totalQuantity} عدد
                  </Badge>
                </div>
              </div>

              <ChevronLeftIcon className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        )
      },
      enableSorting: false,
    },
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
    {
      accessorKey: 'addressId',
      header: 'آدرس',
      cell: ({ row }) => {
        const address = row.original.addressId

        return (
          <div
            className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/30 cursor-pointer transition-colors group"
            onClick={() =>
              setAddressDialogState({
                open: true,
                address: address,
              })
            }
          >
            <div className="flex items-center justify-between">
              <div className={'flex items-center gap-1'}>
                <MapPinIcon className="size-5" />

                <span className="font-semibold truncate">{address?.title || ''}</span>
              </div>

              <div className="text-sm text-muted-foreground truncate mx-2">
                {address ? (
                  <div className={'flex items-center'}>
                    <span className="font-medium">{address.city}</span>
                    <span className="mx-1">•</span>
                    <span>{address.address.substring(0, 25)}...</span>
                  </div>
                ) : (
                  'آدرس ثبت نشده'
                )}
              </div>

              <ChevronLeftIcon className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        )
      },
      enableSorting: false,
    },
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
                  handleStatusChange(row.original._id, value as OrderStatus)
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
    {
      accessorKey: 'paymentStatus',
      header: 'وضعیت پرداخت',
      cell: ({ row }) => PAYMENT_STATUS_CONSTANTS[row.original?.paymentStatus],
      enableSorting: true,
    },
    {
      accessorKey: 'trackingCode',
      header: 'کد رهگیری سفارش',
      cell: ({ row }) => row.original?.trackingCode,
      enableSorting: true,
    },
    {
      accessorKey: 'meta',
      header: 'اطلاعات متا',
      cell: ({ row }) => {
        const meta = row.original?.meta
        const hasPayment = meta?.payment && Object.keys(meta.payment).length > 0
        const hasHistory = meta?.history && meta.history.length > 0
        const historyCount = meta?.history?.length || 0

        return (
          <div
            className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/30 cursor-pointer transition-colors group"
            onClick={() =>
              setMetaDialogState({
                open: true,
                meta: meta,
              })
            }
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <CreditCardIcon className="size-5" />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  {hasPayment && (
                    <div className="flex items-center gap-1">
                      <Badge
                        variant="outline"
                        className="text-xs"
                      >
                        پرداخت
                      </Badge>
                      {meta?.payment?.refId && <span className="font-mono text-xs">#{meta?.payment?.refId.toString()}</span>}
                    </div>
                  )}

                  {hasHistory && (
                    <div className="flex items-center gap-1">
                      <HistoryIcon className="h-3 w-3" />
                      <span>{historyCount} تغییر وضعیت</span>
                    </div>
                  )}

                  {!hasPayment && !hasHistory && <span className="text-muted-foreground">بدون اطلاعات</span>}
                </div>
              </div>
            </div>

            <ChevronLeftIcon className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        )
      },
      enableSorting: false,
    },
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

    setOrders(res?.orders)
    setPagesCount(res?.pagination?.pagesCount)
  }

  useEffect(() => {
    ordersList()
  }, [page, limit])

  // تابع اصلی تغییر وضعیت
  const changeStatus = async (orderId: string, newStatus: OrderStatus, meta?: HistoryMeta) => {
    setLoadingId(orderId)

    try {
      const response = await changeOrderStatus(orderId, newStatus, meta)

      setOrders((prevOrders) => {
        if (!prevOrders || !response?.order) return prevOrders

        // به‌روزرسانی سفارش در لیست
        return prevOrders.filter((order) => order._id !== response.order?._id)
      })

      toast.success(response.message)
    } catch (error) {
      toast.error('خطا در تغییر وضعیت سفارش')
      console.error(error)
    } finally {
      setLoadingId(null)
    }
  }

  // هندلر تغییر وضعیت (ممکن است نیاز به دیالوگ داشته باشد)
  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    // اگر وضعیت جدید نیاز به دلیل دارد
    if (requiresReason(newStatus)) {
      setReasonDialogState({
        open: true,
        orderId,
        newStatus,
        config: getReasonDialogConfig(newStatus),
      })
    }
    // اگر وضعیت جدید نیاز به کد رهگیری دارد
    else if (requiresTrackingCode(newStatus)) {
      setTrackingCodeDialogState({
        open: true,
        orderId,
        newStatus,
      })
    } else {
      // برای سایر وضعیت‌ها، مستقیماً تغییر را اعمال کن
      confirm({
        title: 'تغییر وضعیت سفارش',
        description: `آیا از تغییر وضعیت این سفارش به "${ORDER_STATUS_CONSTANTS[newStatus]}" مطمئن هستید؟`,
        confirmText: 'بله، تغییر بده',
        cancelText: 'لغو',
        onConfirm: () => changeStatus(orderId, newStatus),
      })
    }
  }

  // هندلر تایید دیالوگ دلیل
  const handleReasonSubmit = (reason: string) => {
    const { orderId, newStatus } = reasonDialogState

    // ایجاد meta با دلیل
    const meta: HistoryMeta = {
      reason: reason.trim(),
    }

    // فراخوانی تابع تغییر وضعیت با meta
    changeStatus(orderId, newStatus, meta)

    // بستن دیالوگ
    setReasonDialogState((prev) => ({ ...prev, open: false }))
  }

  // هندلر تایید دیالوگ کد رهگیری
  const handleTrackingCodeSubmit = (trackingCode: string) => {
    const { orderId, newStatus } = trackingCodeDialogState

    // ایجاد meta با کد رهگیری
    const meta: HistoryMeta = {
      trackingCode: trackingCode.trim(),
    }

    // فراخوانی تابع تغییر وضعیت با meta
    changeStatus(orderId, newStatus, meta)

    // بستن دیالوگ
    setTrackingCodeDialogState((prev) => ({ ...prev, open: false }))
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

      {/* دیالوگ دلیل */}
      <ReasonDialog
        open={reasonDialogState.open}
        onOpenChange={(open) => setReasonDialogState((prev) => ({ ...prev, open }))}
        onConfirm={handleReasonSubmit}
        title={reasonDialogState.config.title}
        label={reasonDialogState.config.label}
        placeholder={reasonDialogState.config.placeholder}
        confirmText={reasonDialogState.config.confirmText}
      />

      {/* دیالوگ کد رهگیری */}
      <TrackingCodeDialog
        open={trackingCodeDialogState.open}
        onOpenChange={(open) => setTrackingCodeDialogState((prev) => ({ ...prev, open }))}
        onConfirm={handleTrackingCodeSubmit}
        title="ثبت کد رهگیری پستی"
        description={`برای تغییر وضعیت سفارش به "${ORDER_STATUS_CONSTANTS[OrderStatus.SHIPPED]}"، کد رهگیری را وارد کنید`}
      />

      {/* دیالوگ محصولات */}
      <OrderItemsDialog
        open={itemsDialogState.open}
        onOpenChange={(open) => setItemsDialogState((prev) => ({ ...prev, open }))}
        items={itemsDialogState.items}
      />

      {/* دیالوگ آدرس */}
      <AddressDialog
        open={addressDialogState.open}
        onOpenChange={(open) => setAddressDialogState((prev) => ({ ...prev, open }))}
        address={addressDialogState.address}
      />

      {/* دیالوگ اطلاعات متا */}
      <MetaInfoDialog
        open={metaDialogState.open}
        onOpenChange={(open) => setMetaDialogState((prev) => ({ ...prev, open }))}
        meta={metaDialogState.meta}
      />
    </>
  )
}
