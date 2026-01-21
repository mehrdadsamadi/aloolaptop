// هوک اختصاصی برای دسترسی راحت به کانتکست
import { useContext } from 'react'
import { UserContext } from '@/context/user.context'

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('هوک useUser باید داخل UserProvider استفاده شود.')
  }
  return context
}
