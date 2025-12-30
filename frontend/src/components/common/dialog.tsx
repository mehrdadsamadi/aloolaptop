'use client'

import * as React from 'react'
import {
  Dialog as ShadDialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface DialogProps {
  // کنترل‌کننده‌های اصلی
  trigger?: React.ReactNode
  title: string
  description?: string
  children: React.ReactNode

  // کنترل state از بیرون
  open?: boolean
  onOpenChange?: (open: boolean) => void

  // دکمه‌های action
  showCloseButton?: boolean
  closeButtonText?: string
  showActions?: boolean
  actions?: React.ReactNode

  // استایل‌ها
  triggerClassName?: string
  contentClassName?: string
  headerClassName?: string
  titleClassName?: string
  descriptionClassName?: string
  bodyClassName?: string
  footerClassName?: string

  // تنظیمات
  preventOutsideClick?: boolean
  showOverlay?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

const sizeClasses = {
  sm: 'sm:max-w-sm',
  md: 'sm:max-w-md',
  lg: 'sm:max-w-lg',
  xl: 'sm:max-w-xl',
  full: 'sm:max-w-[95vw]',
}

export function Dialog({
  trigger,
  title,
  description,
  children,
  open,
  onOpenChange,
  showCloseButton = true,
  closeButtonText = 'بستن',
  showActions = true,
  actions,
  triggerClassName,
  contentClassName,
  headerClassName,
  titleClassName,
  descriptionClassName,
  bodyClassName,
  footerClassName,
  preventOutsideClick = false,
  showOverlay = true,
  size = 'md',
}: DialogProps) {
  const [internalOpen, setInternalOpen] = React.useState(false)

  const isControlled = open !== undefined
  const dialogOpen = isControlled ? open : internalOpen
  const setDialogOpen = isControlled ? onOpenChange || (() => {}) : setInternalOpen

  const handleOpenChange = (newOpen: boolean) => {
    if (preventOutsideClick && !newOpen) {
      // اگر preventOutsideClick فعال باشد، فقط از طریق دکمه بستن بسته شود
      return
    }
    setDialogOpen(newOpen)
  }

  return (
    <ShadDialog
      open={dialogOpen}
      onOpenChange={handleOpenChange}
    >
      {open === undefined && trigger && (
        <DialogTrigger
          asChild
          className={triggerClassName}
        >
          {trigger}
        </DialogTrigger>
      )}
      {showOverlay ? (
        <DialogContent
          dir={'rtl'}
          className={cn(sizeClasses[size], contentClassName)}
        >
          <DialogHeader className={cn('text-right!', headerClassName)}>
            <DialogTitle className={titleClassName}>{title}</DialogTitle>
            {description && <DialogDescription className={descriptionClassName}>{description}</DialogDescription>}
          </DialogHeader>

          <div className={cn('py-4', bodyClassName)}>{children}</div>

          {showActions && (
            <DialogFooter className={cn('flex-row-reverse!', footerClassName)}>
              {actions ||
                (showCloseButton && (
                  <DialogClose asChild>
                    <Button
                      type="button"
                      variant="outline"
                    >
                      {closeButtonText}
                    </Button>
                  </DialogClose>
                ))}
            </DialogFooter>
          )}
        </DialogContent>
      ) : (
        // حالت بدون overlay
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-background/80"
            onClick={() => !preventOutsideClick && setDialogOpen(false)}
          />
          <div
            className={cn(
              'relative z-50 grid w-full max-w-lg gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg',
              sizeClasses[size],
              contentClassName
            )}
          >
            <DialogHeader className={cn('text-right!', headerClassName)}>
              <DialogTitle className={titleClassName}>{title}</DialogTitle>
              {description && <DialogDescription className={descriptionClassName}>{description}</DialogDescription>}
            </DialogHeader>

            <div className={cn('py-4', bodyClassName)}>{children}</div>

            {showActions && (
              <DialogFooter className={cn('flex-row-reverse!', footerClassName)}>
                {actions ||
                  (showCloseButton && (
                    <DialogClose asChild>
                      <Button
                        type="button"
                        variant="outline"
                      >
                        {closeButtonText}
                      </Button>
                    </DialogClose>
                  ))}
              </DialogFooter>
            )}
          </div>
        </div>
      )}
    </ShadDialog>
  )
}
