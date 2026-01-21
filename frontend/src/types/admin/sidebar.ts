// types/sidebar.ts
import { ElementType } from 'react'

export interface ISidebarLink {
  title: string
  icon: ElementType
  url: string
  isActive: boolean
  isFavorite: boolean
  items?: {
    title: string
    url: string
  }[]
}

// نوع برای ذخیره در localStorage
export interface ISidebarLinkStorage {
  title: string
  iconName: string
  url: string
  isActive: boolean
  isFavorite: boolean
  items?: {
    title: string
    url: string
  }[]
}
