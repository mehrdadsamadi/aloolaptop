'use client'

import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { HeartIcon, Search, ShoppingCart, UserIcon, LayoutDashboardIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import LinkButton from '@/components/common/linkButton'
import Logo from '@/components/common/logo'
import { useUser } from '@/hooks/useUser'
import { Roles } from '@/lib/enums/roles.enum'

export default function Header() {
  const { user } = useUser()

  return (
    <header
      className={
        'py-5.5 px-35.75 flex items-center justify-between shadow-[0px_2px_5.8px_0px_rgba(0,0,0,0.25)] bg-input-bg text-primary-text'
      }
    >
      <Logo />

      <InputGroup className="max-w-md rounded-full bg-input-bg border-none shadow-[0px_3px_3px_0px_rgba(0,0,0,0.09)] flex-row-reverse">
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
        <InputGroupInput placeholder="جستجو کن تا برات پیداش کنیم" />
      </InputGroup>

      <div className={'flex items-center gap-5'}>
        {user?.role === Roles.ADMIN && (
          <LinkButton
            href={'/admin'}
            variant="ghost"
            size="icon"
          >
            <LayoutDashboardIcon className={'size-5'} />
          </LinkButton>
        )}
        <LinkButton
          href={'/cart'}
          variant="ghost"
          size="icon"
        >
          <ShoppingCart className={'size-5'} />
        </LinkButton>
        <Button
          variant="ghost"
          size="icon"
        >
          <HeartIcon className={'size-5'} />
        </Button>
        <LinkButton
          href={'/user'}
          variant="ghost"
          size="icon"
        >
          <UserIcon className={'size-5'} />
        </LinkButton>
      </div>
    </header>
  )
}
