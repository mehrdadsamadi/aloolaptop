'use server'

import { IPagination } from '@/types/pagination.type'
import { apiFetch } from '@/actions/helpers/fetchClient'
import { ENDPOINTS } from '@/actions/helpers/endpoints'
import { OrderStatus } from '@/types/admin/order.type'

export async function getOrdersList({ pagination, status }: { pagination: IPagination; status: OrderStatus }) {
  const { page = 1, limit = 20 } = pagination

  const res = await apiFetch(ENDPOINTS.ORDERS.LIST({ page, limit, status }), { method: 'GET' })

  return res.json()
}

export interface IOrderMeta {
  trackingCode?: string
  reason?: string
}

export async function changeOrderStatus(orderId: string, orderStatus: OrderStatus, meta?: IOrderMeta) {
  const res = await apiFetch(ENDPOINTS.ORDERS.CHANGE_STATUS(orderId, orderStatus), { method: 'PATCH', body: JSON.stringify(meta) })

  return res.json()
}
