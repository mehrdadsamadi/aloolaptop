import { Params } from '@/types/params.type'
import OrderDetail from '@/app/user/orders/[id]/OrderDetail'

export default async function OrderDetailPage({ params }: { params: Params<{ id: string }> }) {
  const { id } = await params

  return <OrderDetail id={id} />
}
