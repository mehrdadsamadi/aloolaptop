export interface IUser {
  _id: string
  mobile: string
  mobileVerified: boolean
  role: string
  profile: Profile
  createdAt: string
  updatedAt: string
  otpId: string
}

export interface Profile {
  avatar?: Avatar
  firstName?: string
  lastName?: string
}

export interface Avatar {
  url: string
  key: string
}

export interface Pagination {
  total: number
  page: number
  limit: number
  pagesCount: number
}
