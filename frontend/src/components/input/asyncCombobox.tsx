'use client'

import * as React from 'react'
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { apiFetch } from '@/actions/helpers/fetchClient' // نوع داده‌ای برای آیتم‌های شما

interface AsyncComboboxProps {
  /** آدرس API برای جستجو */
  apiUrl: string
  /** پارامترهای ثابت (fixed) برای اضافه شدن به درخواست */
  fixedFilters?: Record<string, string>
  /** مقدار اولیه انتخاب شده */
  initialValue?: string
  /** placeholder برای اینپوت */
  placeholder?: string
  /** تابعی که هنگام تغییر مقدار انتخاب شده فراخوانی می‌شود */
  onValueChange?: (value: string) => void
}

export function AsyncCombobox({
  apiUrl,
  fixedFilters = {},
  initialValue = '',
  placeholder = 'جستجو کنید...',
  onValueChange,
}: AsyncComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [selectedValue, setSelectedValue] = React.useState<string>(initialValue)
  const [searchQuery, setSearchQuery] = React.useState('')
  const [items, setItems] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [page, setPage] = React.useState(1)
  const [hasMore, setHasMore] = React.useState(true)

  // استفاده از ref برای ذخیره تایمر debounce
  const debounceTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)

  // تابع اصلی برای دریافت داده از API
  const fetchItems = async (query: string, pageNum: number, isNewSearch: boolean) => {
    if (!hasMore && pageNum > 1 && !isNewSearch) return

    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        ...(query && { name: query }),
        page: pageNum.toString(),
        limit: '20',
        ...fixedFilters, // اضافه کردن فیلترهای ثابت شما
      })

      const response = await apiFetch(`${apiUrl}?${params.toString()}`, { method: 'GET' })
      console.log('res', response)
      if (response?.ok === false) throw new Error('خطا در دریافت داده‌ها')

      const data: { categories: any[]; pagination: { pagesCount: number } } = await response.json()

      if (isNewSearch) {
        setItems(data.categories)
      } else {
        setItems((prev) => [...prev, ...data.categories])
      }

      setHasMore(pageNum < data.pagination.pagesCount)
      setPage(pageNum)
    } catch (error) {
      console.error('خطا در واکشی:', error)
      // در اینجا می‌توانید state خطا نیز مدیریت کنید
    } finally {
      setIsLoading(false)
    }
  }

  // استفاده از debounce برای جستجو
  React.useEffect(() => {
    // پاک کردن تایمر قبلی
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
    }

    // تنظیم تایمر جدید
    debounceTimeoutRef.current = setTimeout(() => {
      if (searchQuery.trim() !== '' || open) {
        fetchItems(searchQuery, 1, true)
      } else {
        setItems([])
      }
    }, 300) // تأخیر 300 میلی‌ثانیه

    // پاک‌سازی تایمر هنگام unmount
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }
    }
  }, [searchQuery, open, apiUrl])

  // مدیریت اسکرول برای بارگذاری تدریجی
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget
    const isAtBottom = element.scrollHeight - element.scrollTop === element.clientHeight

    if (isAtBottom && hasMore && !isLoading) {
      fetchItems(searchQuery, page + 1, false)
    }
  }

  // مدیریت انتخاب یک آیتم
  const handleSelect = (currentValue: string) => {
    const newValue = currentValue === selectedValue ? '' : currentValue
    setSelectedValue(newValue)
    setOpen(false)
    if (onValueChange) {
      onValueChange(newValue)
    }
  }

  // پیدا کردن عنوان (label) برای مقدار انتخاب شده
  const selectedItemLabel = selectedValue ? items.find((item) => item.value === selectedValue)?.label : placeholder

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          <span className="truncate">{selectedItemLabel}</span>
          <ChevronsUpDown className="mr-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-full p-0"
        align="start"
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={placeholder}
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList
            onScroll={handleScroll}
            className="max-h-[300px]"
          >
            {isLoading && items.length === 0 ? (
              <div className="flex justify-center py-6">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                <CommandEmpty>{isLoading ? 'در حال جستجو...' : 'نتیجه‌ای یافت نشد.'}</CommandEmpty>
                <CommandGroup>
                  {items.map((item) => (
                    <CommandItem
                      key={item._id}
                      value={item._id}
                      onSelect={handleSelect}
                    >
                      <Check className={cn('ml-2 h-4 w-4', selectedValue === item._id ? 'opacity-100' : 'opacity-0')} />
                      {item.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
                {isLoading && items.length > 0 && (
                  <div className="flex justify-center py-2">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                )}
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
