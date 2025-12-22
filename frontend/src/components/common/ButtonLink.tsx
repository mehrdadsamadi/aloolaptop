import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import Link from 'next/link'
import { PropsWithChildren } from 'react'

export default function ButtonLink({ href, children }: PropsWithChildren<{ href: string }>) {
  return (
    <Link
      href={href}
      className={cn(buttonVariants({ variant: 'default', size: 'default' }), 'cursor-pointer')}
    >
      {children}
    </Link>
  )
}
