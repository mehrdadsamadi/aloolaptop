import { IImage } from '@/types/image.type'

export interface IImageArchive {
  _id: string
  title: string
  image: IImage
  createdAt: string
  updatedAt: string
}