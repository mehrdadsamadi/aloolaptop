import { ChevronDown, Menu } from 'lucide-react'
import Link from 'next/link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function SubHeader() {
  return (
    <div
      className={
        'px-6.25 py-2.5 rounded-full bg-input-bg shadow-[0px_2px_6.4px_0px_rgba(0,0,0,0.25)] flex items-center justify-between mt-4 mb-8 font-bold text-primary-text'
      }
    >
      <div className={'flex items-center gap-2 cursor-pointer'}>
        <Menu />
        <p>دسته بندی ها</p>
      </div>

      <div className={'flex items-center gap-10'}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className={'flex items-center gap-2 cursor-pointer'}>
              <p>خرید سیستم</p>
              <ChevronDown />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuLabel>سیستم</DropdownMenuLabel>
              <DropdownMenuItem>سیستم ۱</DropdownMenuItem>
              <DropdownMenuItem>سیستم ۲</DropdownMenuItem>
              <DropdownMenuItem>سیستم ۳</DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuLabel>لپ تاپ</DropdownMenuLabel>
              <DropdownMenuItem>لپ تاپ ۱</DropdownMenuItem>
              <DropdownMenuItem>لپ تاپ ۲</DropdownMenuItem>
              <DropdownMenuItem>لپ تاپ ۳</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className={'flex items-center gap-2 cursor-pointer'}>
              <p>قطعات اصلی سیستم</p>
              <ChevronDown />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuLabel>سیستم</DropdownMenuLabel>
              <DropdownMenuItem>سیستم ۱</DropdownMenuItem>
              <DropdownMenuItem>سیستم ۲</DropdownMenuItem>
              <DropdownMenuItem>سیستم ۳</DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuLabel>لپ تاپ</DropdownMenuLabel>
              <DropdownMenuItem>لپ تاپ ۱</DropdownMenuItem>
              <DropdownMenuItem>لپ تاپ ۲</DropdownMenuItem>
              <DropdownMenuItem>لپ تاپ ۳</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className={'flex items-center gap-2 cursor-pointer'}>
              <p>لوازم جانبی</p>
              <ChevronDown />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuLabel>سیستم</DropdownMenuLabel>
              <DropdownMenuItem>سیستم ۱</DropdownMenuItem>
              <DropdownMenuItem>سیستم ۲</DropdownMenuItem>
              <DropdownMenuItem>سیستم ۳</DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuLabel>لپ تاپ</DropdownMenuLabel>
              <DropdownMenuItem>لپ تاپ ۱</DropdownMenuItem>
              <DropdownMenuItem>لپ تاپ ۲</DropdownMenuItem>
              <DropdownMenuItem>لپ تاپ ۳</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className={'flex items-center gap-2 cursor-pointer'}>
              <p>خدمات و تعمیرات</p>
              <ChevronDown />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuLabel>سیستم</DropdownMenuLabel>
              <DropdownMenuItem>سیستم ۱</DropdownMenuItem>
              <DropdownMenuItem>سیستم ۲</DropdownMenuItem>
              <DropdownMenuItem>سیستم ۳</DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuLabel>لپ تاپ</DropdownMenuLabel>
              <DropdownMenuItem>لپ تاپ ۱</DropdownMenuItem>
              <DropdownMenuItem>لپ تاپ ۲</DropdownMenuItem>
              <DropdownMenuItem>لپ تاپ ۳</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <Link href={'/'}>تماس با ما</Link>
      </div>
    </div>
  )
}
