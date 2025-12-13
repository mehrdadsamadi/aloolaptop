import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { IUser } from '@/context/user.context'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const convertFaToEn = (str: string) => str.replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))

export const getFullName = (user: IUser | null) => {
  return user?.profile?.firstName + ' ' + user?.profile?.lastName
}

export function formatPersianDate(date: string | Date) {
  return new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}
