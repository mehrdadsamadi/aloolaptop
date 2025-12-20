import { IImage } from '@/types/image.type'

export interface ICategory {
  _id: string
  name: string
  slug: string
  description: string
  parentId: string | null
  parent: Parent | null
  attributes: ICategoryAttribute[]
  isActive: boolean
  order: number
  image: IImage
  createdAt: string
  updatedAt: string
}

export interface ICategoryAttribute {
  key: string
  label: string
  type: AttributeType
  options?: string[]
  showInFilter: boolean
  required: boolean
}

export interface Parent {
  id: string
  _id: string
  name: string
}

export enum AttributeType {
  STRING = 'string',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  SELECT = 'select',
  RANGE = 'range',
}
