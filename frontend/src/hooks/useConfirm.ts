import { useContext } from 'react'
import { ConfirmContext } from '@/context/confirmDialog.context'

export const useConfirm = () => {
  const ctx = useContext(ConfirmContext)

  if (!ctx) throw new Error('هوک useConfirm باید داخل ConfirmDialogProvider استفاده شود')

  return ctx
}
