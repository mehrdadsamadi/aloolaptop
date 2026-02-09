import { OrderStatus } from '@/types/admin/order.type'
import { SearchParams } from '@/types/params.type'
import UserOrders from '@/app/user/orders/UserOrders'

export default async function UserOrdersPage({ searchParams }: { searchParams: SearchParams<{ status: OrderStatus | 'all' }> }) {
  const { status = 'all' } = await searchParams

  return <UserOrders status={status} />
}
