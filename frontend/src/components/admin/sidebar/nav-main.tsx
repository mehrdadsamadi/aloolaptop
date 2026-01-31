'use client'

import { ChevronRight } from 'lucide-react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { usePathname, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ISidebarLink } from '@/types/admin/sidebar'

export default function NavMain({ items }: { items: ISidebarLink[] }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { toggleSidebar, isMobile } = useSidebar()

  // تابع برای جدا کردن path از query string
  const getPathWithoutQuery = (url: string) => {
    // جدا کردن query string از URL
    const [path] = url.split('?')
    return path
  }

  // تابع برای گرفتن query string فعلی
  const getCurrentQuery = () => {
    return searchParams.toString()
  }

  // تابع isActive برای main items
  const isActive = (url: string) => {
    const cleanUrl = getPathWithoutQuery(url)
    const cleanPathname = getPathWithoutQuery(pathname)
    return cleanPathname === cleanUrl
  }

  // تابع isActive برای sub items که query string را هم در نظر می‌گیرد
  const isSubItemActive = (subItemUrl: string) => {
    const [subItemPath, subItemQuery] = subItemUrl.split('?')

    // اگر آدرس فعلی دقیقاً مشابه subItem باشد (با query string)
    if (pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '') === subItemUrl) {
      return true
    }

    // یا اگر pathname یکسان باشد (برای مواقعی که فقط path مهم است)
    if (pathname === subItemPath) {
      // اگر subItem query string داشته باشد، باید دقیقاً مطابقت داشته باشد
      if (subItemQuery) {
        const currentQuery = searchParams.toString()
        // تبدیل query string‌ها به object برای مقایسه
        const subItemParams = new URLSearchParams(subItemQuery)
        const currentParams = new URLSearchParams(currentQuery)

        // مقایسه تعداد پارامترها و مقادیر آنها
        if (subItemParams.toString() === currentParams.toString()) {
          return true
        }
      } else {
        // اگر subItem query string نداشته باشد، pathname یکسان کافی است
        return true
      }
    }

    return false
  }

  // تابع برای بررسی اینکه آیا یکی از sub items فعال است
  const hasActiveSubItem = (subItems: { title: string; url: string }[] = []) => {
    return subItems.some((subItem) => isSubItemActive(subItem.url))
  }

  const handleToggleSidebar = () => {
    if (isMobile) {
      toggleSidebar()
    }
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>داشبورد</SidebarGroupLabel>
      <SidebarMenu>
        {items?.map((item, i) =>
          item?.items && item?.items?.length ? (
            <Collapsible
              key={i}
              asChild
              defaultOpen={hasActiveSubItem(item?.items)} // باز بودن اگر یکی از sub items فعال باشد
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item?.title}>
                    {item.icon && <item.icon />}
                    <span>{item?.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 rotate-180 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <SidebarMenuSub className={'border-l-0 border-r'}>
                    {item?.items?.map((subItem, index) => (
                      <SidebarMenuSubItem key={index}>
                        <SidebarMenuSubButton
                          asChild
                          isActive={isSubItemActive(subItem?.url)} // اصلاح شده: استفاده از subItem.url
                        >
                          <Link
                            href={subItem?.url}
                            onClick={handleToggleSidebar}
                          >
                            <span>{subItem?.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ) : (
            <SidebarMenuItem key={i}>
              <SidebarMenuButton
                asChild
                isActive={isActive(item?.url)}
              >
                <Link
                  href={item?.url}
                  onClick={handleToggleSidebar}
                >
                  {item.icon && <item.icon />}
                  <span>{item?.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        )}
      </SidebarMenu>
    </SidebarGroup>
  )
}
