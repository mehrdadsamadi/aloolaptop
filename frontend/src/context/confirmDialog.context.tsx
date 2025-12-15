'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { createContext, useState } from 'react'

type ConfirmOptions = {
  title?: string
  description?: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void | Promise<void>
}

type ConfirmContextType = {
  confirm: (options: ConfirmOptions) => void
}

export const ConfirmContext = createContext<ConfirmContextType | null>(null)

export function ConfirmDialogProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [options, setOptions] = useState<ConfirmOptions | null>(null)

  const confirm = (opts: ConfirmOptions) => {
    setOptions(opts)
    setOpen(true)
  }

  const handleConfirm = async () => {
    await options?.onConfirm()
    setOpen(false)
  }

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}

      <AlertDialog
        open={open}
        onOpenChange={setOpen}
      >
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle className={'text-right'}>{options?.title ?? 'آیا مطمئن هستید؟'}</AlertDialogTitle>
            {options?.description && <AlertDialogDescription className={'text-right'}>{options.description}</AlertDialogDescription>}
          </AlertDialogHeader>

          <AlertDialogFooter className={'justify-start w-fit'}>
            <AlertDialogAction
              className={'cursor-pointer'}
              onClick={handleConfirm}
            >
              {options?.confirmText ?? 'تأیید'}
            </AlertDialogAction>
            <AlertDialogCancel className={'cursor-pointer'}>{options?.cancelText ?? 'لغو'}</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ConfirmContext.Provider>
  )
}
