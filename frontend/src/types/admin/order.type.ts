export interface IOrder {
  _id: string
  userId: UserId
  items: Item[]
  totalQuantity: number
  totalItems: number
  finalItemsPrice: number
  couponId: CouponId
  discountAmount: number
  totalPrice: number
  addressId: AddressId
  status: OrderStatus
  paymentStatus: PaymentStatus
  trackingCode: string
  createdAt: string
  updatedAt: string
  meta: Meta
}

export interface UserId {
  _id: string
  mobile: string
  profile: Profile
  id: string
}

export interface Profile {
  firstName: string
  lastName: string
  avatar: Avatar
}

export interface Avatar {
  url: string
  key: string
}

export interface Item {
  productId: string
  name: string
  image: string
  unitPrice: number
  discountPercent: number
  finalUnitPrice: number
  quantity: number
  totalPrice: number
  _id: string
  createdAt: string
  updatedAt: string
}

export interface CouponId {
  _id: string
  code: string
}

export interface AddressId {
  _id: string
  userId: string
  title: string
  city: string
  state: string
  postalCode: string
  address: string
  location: Location
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

export interface Location {
  type: string
  coordinates: number[]
}

export interface Meta {
  payment: Payment
  history: History[]
}

export interface Payment {
  refId: number
  fee: number
  code: number
}

export interface History {
  from: OrderStatus
  to: OrderStatus
  at: string
  meta: HistoryMeta
}

export interface HistoryMeta {
  trackingCode?: string
  reason?: string
}

export enum OrderStatus {
  AWAITING_PAYMENT = 'awaiting_payment',
  PAID = 'paid',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELED = 'canceled',
  REFUNDED = 'refunded', // بازگشت مبلغ به کاربر
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded', // بازگشت مبلغ به کاربر
}
