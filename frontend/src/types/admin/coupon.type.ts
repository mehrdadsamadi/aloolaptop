export interface ICoupon {
  _id: string
  code: string
  type: CouponType
  method: DiscountMethod
  value: number
  productIds: ProductId[]
  minOrderAmount: number
  maxUses: number
  usesCount: number
  startDate: string
  endDate: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface ProductId {
  _id: string
  name: string
  id: string
}

export enum CouponType {
  PRODUCT = 'PRODUCT',
  CART = 'CART',
}

export enum DiscountMethod {
  PERCENT = 'PERCENT',
  AMOUNT = 'AMOUNT',
}
