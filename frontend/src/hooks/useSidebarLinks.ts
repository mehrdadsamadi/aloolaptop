// hooks/use-sidebar-links.ts
import { useCallback, useEffect, useState } from 'react'
import { BoxesIcon, LaptopMinimalIcon, LayoutDashboardIcon, ListIcon, TicketPercentIcon, UsersIcon } from 'lucide-react'
import { ISidebarLink, ISidebarLinkStorage } from '@/types/admin/sidebar'

const iconMap = {
  LayoutDashboardIcon,
  ListIcon,
  BoxesIcon,
  TicketPercentIcon,
  UsersIcon,
  LaptopMinimalIcon,
}

const STORAGE_KEY = 'sidebarLinks'

const defaultLinks: ISidebarLink[] = [
  {
    title: 'داشبورد',
    url: '/admin',
    icon: LayoutDashboardIcon,
    isActive: true,
    isFavorite: true,
  },
  {
    title: 'دسته بندی ها',
    url: '/admin/categories',
    icon: ListIcon,
    isActive: false,
    isFavorite: true,
  },
  {
    title: 'محصولات',
    url: '/admin/products',
    icon: BoxesIcon,
    isActive: false,
    isFavorite: true,
  },
  {
    title: 'کوپن تخفیف',
    url: '/admin/coupons',
    icon: TicketPercentIcon,
    isActive: false,
    isFavorite: true,
  },
  {
    title: 'کاربران',
    url: '/admin/users',
    icon: UsersIcon,
    isActive: false,
    isFavorite: false,
    items: [
      {
        title: 'لیست کاربران',
        url: '/admin/users',
      },
      {
        title: 'دیدگاه ها و امتیاز ها',
        url: '/admin/reviews',
      },
    ],
  },
  {
    title: 'سفارشات',
    url: '/admin/orders',
    icon: LaptopMinimalIcon,
    isActive: false,
    isFavorite: false,
    items: [
      {
        title: 'منتظر پرداخت',
        url: '/admin/orders?status=awaiting_payment',
      },
      {
        title: 'پرداخت شده',
        url: '/admin/orders?status=paid',
      },
      {
        title: 'درحال پردازش',
        url: '/admin/orders?status=processing',
      },
      {
        title: 'ارسال شده',
        url: '/admin/orders?status=shipped',
      },
      {
        title: 'تحویل داده شده',
        url: '/admin/orders?status=delivered',
      },
      {
        title: 'لغو شده',
        url: '/admin/orders?status=canceled',
      },
      {
        title: 'برگشت خورده',
        url: '/admin/orders?status=refunded',
      },
    ],
  },
]

export function useSidebarLinks() {
  const [links, setLinks] = useState<ISidebarLink[]>(defaultLinks)
  const [isLoading, setIsLoading] = useState(true)

  // تبدیل به فرمت ذخیره‌سازی
  const convertToStorage = useCallback((links: ISidebarLink[]): ISidebarLinkStorage[] => {
    return links.map((link) => ({
      title: link.title,
      url: link.url,
      isActive: link.isActive,
      isFavorite: link.isFavorite,
      iconName: Object.keys(iconMap).find((key) => iconMap[key as keyof typeof iconMap] === link.icon) || 'LayoutDashboardIcon',
      items: link.items,
    }))
  }, [])

  // تبدیل از فرمت ذخیره‌سازی
  const convertFromStorage = useCallback((storageLinks: ISidebarLinkStorage[]): ISidebarLink[] => {
    return storageLinks.map((link) => ({
      ...link,
      icon: iconMap[link.iconName as keyof typeof iconMap] || LayoutDashboardIcon,
    }))
  }, [])

  // بارگذاری لینک‌ها
  const loadLinks = useCallback(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const storageLinks: ISidebarLinkStorage[] = JSON.parse(saved)
        return convertFromStorage(storageLinks)
      }
    } catch (error) {
      console.error('Error loading sidebar links:', error)
    }
    return null
  }, [convertFromStorage])

  // ذخیره لینک‌ها
  const saveLinks = useCallback(
    (links: ISidebarLink[]) => {
      try {
        const storageLinks = convertToStorage(links)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(storageLinks))
      } catch (error) {
        console.error('Error saving sidebar links:', error)
      }
    },
    [convertToStorage]
  )

  // به‌روزرسانی وضعیت favorite
  const updateFavorite = useCallback(
    (title: string, isFavorite: boolean) => {
      setLinks((prev) => {
        const updated = prev.map((link) => (link.title === title ? { ...link, isFavorite } : link))
        saveLinks(updated)
        return updated
      })
    },
    [saveLinks]
  )

  // به‌روزرسانی همه لینک‌ها
  const updateAllLinks = useCallback(
    (newLinks: ISidebarLink[]) => {
      setLinks(newLinks)
      saveLinks(newLinks)
    },
    [saveLinks]
  )

  // مقداردهی اولیه
  useEffect(() => {
    const loadedLinks = loadLinks()
    if (loadedLinks) {
      setLinks(loadedLinks)
    } else {
      // ذخیره‌سازی اولیه
      saveLinks(defaultLinks)
    }
    setIsLoading(false)
  }, [loadLinks, saveLinks])

  return {
    links,
    isLoading,
    updateFavorite,
    updateAllLinks,
    saveLinks,
    loadLinks,
  }
}
