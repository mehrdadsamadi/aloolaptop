// components/ui/icon-button.tsx
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { PropsWithChildren } from 'react'
import type { VariantProps } from 'class-variance-authority'

interface IconButtonProps extends PropsWithChildren, VariantProps<typeof buttonVariants> {
  className?: string
}

export function IconButton({ className, size = 'default', ...props }: IconButtonProps) {
  return (
    <Button
      size={size}
      className={cn('rounded-full p-2', size === 'sm' && 'p-1', size === 'lg' && 'p-3', className)}
      {...props}
    />
  )
}
