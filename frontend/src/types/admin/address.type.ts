export interface IAddress {
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
