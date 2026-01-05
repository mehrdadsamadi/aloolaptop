import AdminOrders from '@/app/admin/orders/AdminOrders'
import { OrderStatus } from '@/types/admin/order.type'
import { SearchParams } from '@/types/params.type'
import { ORDER_STATUS_CONSTANTS } from '@/lib/constants/order.constant'
import { ExportButton } from '@/components/common/exportButton'

export default async function AdminOrdersPage({ searchParams }: { searchParams: SearchParams<{ status: OrderStatus }> }) {
  const { status } = await searchParams

  return (
    <section className="h-full">
      <div className={'flex items-center justify-between w-full mb-4 bg-gray-50 rounded-lg p-3'}>
        <h1 className="text-lg">لیست سفارشات - {ORDER_STATUS_CONSTANTS[status]}</h1>

        <ExportButton status={status} />
      </div>

      <AdminOrders
        key={status}
        status={status}
      />
    </section>
  )
}
