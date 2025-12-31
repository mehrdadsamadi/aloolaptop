import { IImage } from '@/types/image.type'

export interface IReview {
  _id: string
  userId: UserId
  productId: ProductId
  rating: number
  comment: string
  isVisible: boolean
  createdAt: string
  updatedAt: string
}

export interface UserId {
  _id: string
  profile: Profile
  mobile: string
  id: string
}

export interface Profile {
  firstName: string
  lastName: string
  avatar: IImage
}

export interface ProductId {
  _id: string
  name: string
  images: IImage[]
  rate: number
  id: string
}
