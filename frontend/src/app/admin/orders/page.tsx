import AdminOrders from '@/app/admin/orders/AdminOrders'
import { OrderStatus } from '@/types/admin/order.type'
import { SearchParams } from '@/types/params.type'
import { ORDER_STATUS_CONSTANTS } from '@/lib/constants/order.constant'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default async function AdminOrdersPage({ searchParams }: { searchParams: SearchParams<{ status: OrderStatus }> }) {
  const { status } = await searchParams

  return (
    <section className="h-full">
      <div className={'flex items-center justify-between w-full mb-4 bg-gray-50 rounded-lg p-3'}>
        <h1 className="text-lg">لیست سفارشات - {ORDER_STATUS_CONSTANTS[status]}</h1>

        <Button
          variant="outline"
          disabled
        >
          <Plus className="h-4 w-4" />
          خروجی گزارش
        </Button>
      </div>

      <AdminOrders
        key={status}
        status={status}
      />
    </section>
  )
}
