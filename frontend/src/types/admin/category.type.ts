export interface ICategory {
  _id: string
  name: string
  slug: string
  description: string
  parentId: string | null
  parent: Parent | null
  attributes: Attribute[]
  isActive: boolean
  order: number
  image: Image
  createdAt: string
  updatedAt: string
}

export interface Attribute {
  key: string
  label: string
  type: string
  options: string[]
  showInFilter: boolean
  required: boolean
}

export interface Image {
  url: string
  key: string
}

export interface Parent {
  id: string
  _id: string
  name: string
}
