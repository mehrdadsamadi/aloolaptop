// app/admin/orders/_components/TrackingCodeDialog.tsx
'use client'

import { Dialog } from '@/components/common/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useEffect, useState } from 'react'

interface TrackingCodeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (trackingCode: string) => void
  title?: string
  description?: string
  label?: string
  placeholder?: string
  confirmText?: string
  cancelText?: string
}

export default function TrackingCodeDialog({
  open,
  onOpenChange,
  onConfirm,
  title = 'کد رهگیری پستی',
  description = 'لطفا کد رهگیری پستی را وارد کنید',
  label = 'کد رهگیری *',
  placeholder = 'مثال: RA123456789IR',
  confirmText = 'ثبت کد رهگیری',
  cancelText = 'انصراف',
}: TrackingCodeDialogProps) {
  const [trackingCode, setTrackingCode] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // وقتی دیالوگ بسته می‌شود، state را ریست کنیم
  useEffect(() => {
    if (!open) {
      setIsSubmitting(false)
    }
  }, [open])

  const handleConfirm = async () => {
    if (!trackingCode.trim()) return

    setIsSubmitting(true)
    try {
      await onConfirm(trackingCode)
      setTrackingCode('')
      onOpenChange(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setTrackingCode('')
    onOpenChange(false)
  }

  // اعتبارسنجی کد رهگیری (اختیاری)
  const isValidTrackingCode = trackingCode.trim().length >= 8

  return (
    <Dialog
      trigger={<div />}
      title={title}
      description={description}
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
            onClick={handleConfirm}
            disabled={!trackingCode.trim() || isSubmitting || !isValidTrackingCode}
          >
            {isSubmitting ? 'در حال پردازش...' : confirmText}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label
            htmlFor="tracking-code-input"
            className="text-right"
          >
            {label}
          </Label>
          <Input
            id="tracking-code-input"
            value={trackingCode}
            onChange={(e) => setTrackingCode(e.target.value)}
            placeholder={placeholder}
            required
            className="font-mono text-lg"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                if (trackingCode.trim() && isValidTrackingCode) {
                  handleConfirm()
                }
              }
            }}
            dir="ltr" // برای کد انگلیسی بهتر است ltr باشد
          />

          {/* راهنمای فرمت کد رهگیری */}
          <div className="space-y-1 text-sm">
            <p className="text-muted-foreground">کد رهگیری معمولاً شامل ۱۳-۲۰ کاراکتر (حروف و اعداد) می‌باشد.</p>
            {trackingCode && !isValidTrackingCode && <p className="text-destructive text-xs">کد رهگیری باید حداقل ۸ کاراکتر داشته باشد.</p>}
            {trackingCode && isValidTrackingCode && <p className="text-green-600 text-xs">✓ فرمت کد رهگیری قابل قبول است.</p>}
          </div>
        </div>
      </div>
    </Dialog>
  )
}
