// app/components/admin/BackButton.tsx
'use client'

import { Button } from '@/components/ui/button'
import { ArrowRightIcon } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'

export function BackButton() {
  const router = useRouter()
  const pathname = usePathname()

  const handleClick = () => {
    if (pathname === '/admin') return router.push('/')

    router.back()
  }

  return (
    <Button
      variant={'outline'}
      size={'icon'}
      className={'mr-auto'}
      onClick={handleClick}
    >
      <ArrowRightIcon />
    </Button>
  )
}
