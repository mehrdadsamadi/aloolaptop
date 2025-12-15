import { BadgeAlert } from 'lucide-react'
import { Alert, AlertTitle } from '@/components/ui/alert'

export default function NoData() {
  return (
    <Alert>
      <BadgeAlert />
      <AlertTitle>داده ای یافت نشد</AlertTitle>
    </Alert>
  )
}
