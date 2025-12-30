'use client'

import { Dialog } from '@/components/common/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useEffect, useState } from 'react'

interface ReasonDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (reason: string) => void
  title?: string
  label?: string
  placeholder?: string
  confirmText?: string
  cancelText?: string
}

export default function ReasonDialog({
  open,
  onOpenChange,
  onConfirm,
  title = 'دلیل',
  label = 'دلیل *',
  placeholder = 'لطفاً دلیل را وارد کنید...',
  confirmText = 'تایید',
  cancelText = 'انصراف',
}: ReasonDialogProps) {
  const [reason, setReason] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // وقتی دیالوگ بسته می‌شود، state را ریست کنیم
  useEffect(() => {
    if (!open) {
      setReason('')
      setIsSubmitting(false)
    }
  }, [open])

  const handleConfirm = async () => {
    if (!reason.trim()) return

    setIsSubmitting(true)
    try {
      await onConfirm(reason)
      setReason('')
      onOpenChange(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setReason('')
    onOpenChange(false)
  }

  return (
    <Dialog
      trigger={<div />}
      title={title}
      open={open}
      onOpenChange={onOpenChange}
      size="md"
      actions={
        <>
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            {cancelText}
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={!reason.trim() || isSubmitting}
          >
            {isSubmitting ? 'در حال پردازش...' : confirmText}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label
            htmlFor="reason-textarea"
            className="text-right"
          >
            {label}
          </Label>
          <Textarea
            id="reason-textarea"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={placeholder}
            rows={4}
            required
            className="resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault()
                handleConfirm()
              }
            }}
          />
          <p className="text-sm text-muted-foreground">این دلیل برای مشتری نمایش داده خواهد شد.</p>
        </div>
      </div>
    </Dialog>
  )
}
