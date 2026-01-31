import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { type VariantProps } from 'class-variance-authority'
import Link from 'next/link'
import { PropsWithChildren } from 'react'

interface ButtonLinkProps extends PropsWithChildren, VariantProps<typeof buttonVariants> {
  href: string
  className?: string
}

export default function LinkButton({
  href,
  children,
  variant = 'default',
  size = 'default',
  className,
  ...props // برای سایر propها مانند asChild اگر وجود دارد
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={cn(buttonVariants({ variant, size }), 'cursor-pointer', className)}
      {...props}
    >
      {children}
    </Link>
  )
}
