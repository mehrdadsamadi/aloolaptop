import { IImage } from '@/types/image.type'

export interface IProduct {
  _id: string
  name: string
  slug: string
  description: string
  categoryId: CategoryId
  condition: ProductCondition
  grade: ProductGrade
  price: number
  stock: number
  attributes: Attribute[]
  images: IImage[]
  isActive: boolean
  discountPercent: number
  discountExpiresAt: Date
  createdAt: string
  updatedAt: string
  rate: number
  finalPrice: number
  id: string
}

export interface CategoryId {
  _id: string
  name: string
  id: string
}

export interface Attribute {
  key: string
  value: string
  label: string
  _id: string
  id: string
}

export enum ProductCondition {
  NEW = 'new',
  USED = 'used',
}

export enum ProductGrade {
  A = 'A',
  A_PLUS = 'A+',
  A_DOUBLE_PLUS = 'A++',
  A_TRIPLE_PLUS = 'A+++',
}
