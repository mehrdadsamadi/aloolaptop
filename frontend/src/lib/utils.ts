import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { toast } from 'sonner'
import { Profile } from '@/types/admin/order.type'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const convertFaToEn = (str: string) => str.replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))

export const getFullName = (profile: Profile | null) => {
  if (profile?.firstName === undefined) return ''

  return profile?.firstName + ' ' + profile?.lastName
}

export function formatPersianDate(date: string | Date) {
  return new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}

export function getImageUrl(url: string | undefined) {
  return url ?? '/images/image-placeholder.jpeg'
}

export function showError(messages: string[]) {
  messages.forEach((message) => toast.error(message))
}
