import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { HeartIcon, Search, ShoppingCart, UserIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import LinkButton from '@/components/common/linkButton'
import Logo from '@/components/common/logo'

export default function Header() {
  return (
    <header
      className={'py-5.5 px-35.75 flex items-center justify-between shadow-[0px_2px_5.8px_0px_rgba(0,0,0,0.25)] bg-btn-txt text-dark'}
    >
      <Logo />

      <InputGroup className="max-w-md rounded-full bg-input-bg border-none shadow-[0px_3px_3px_0px_rgba(0,0,0,0.09)] flex-row-reverse">
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
        <InputGroupInput placeholder="جستجو کن تا برات پیداش کنیم" />
      </InputGroup>

      <div className={'flex items-center gap-5'}>
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
        <Button
          variant="ghost"
          size="icon"
        >
          <UserIcon className={'size-5'} />
        </Button>
      </div>
    </header>
  )
}
