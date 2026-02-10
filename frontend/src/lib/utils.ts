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

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function getImageUrl(url: string | undefined) {
  return url ?? '/images/image-placeholder.jpeg'
}

export function showError(messages: string[]) {
  messages.forEach((message) => toast.error(message))
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('fa-IR').format(price) + ' تومان'
}

export function calculateDiscount(price: number, percent: number): number {
  return price * (1 - percent / 100)
}

export function getRemainingTime(expiryDate: Date): string {
  const now = new Date()
  const diff = expiryDate.getTime() - now.getTime()

  if (diff <= 0) return 'منقضی شده'

  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

  return `${hours}h ${minutes}m`
}
