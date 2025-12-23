'use client'

import * as React from 'react'
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { getData } from '@/actions/helpers/fetchClient'

interface AsyncComboboxProps {
  apiUrl: string
  apiField: string
  queryField: string
  fixedFilters?: Record<string, string>
  initialValue?: string
  placeholder?: string
  onValueChange?: (value: string) => void
}

export function AsyncCombobox({
  apiUrl,
  apiField,
  queryField,
  fixedFilters = {},
  initialValue = '',
  placeholder = 'جستجو کنید...',
  onValueChange,
}: AsyncComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [selectedValue, setSelectedValue] = React.useState<string>(initialValue)
  const [selectedItem, setSelectedItem] = React.useState<any>(null)
  const [searchQuery, setSearchQuery] = React.useState('')
  const [items, setItems] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [page, setPage] = React.useState(1)
  const [hasMore, setHasMore] = React.useState(true)

  const debounceTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)

  // استفاده از ref برای جلوگیری از رندرهای اضافی
  const initialValueRef = React.useRef<string | undefined>(initialValue)

  // استفاده از ref برای پیگیری اینکه آیا initialValue رو لود کرده‌ایم یا نه
  const hasLoadedInitialRef = React.useRef(false)

  // تابع برای بارگذاری آیتم انتخاب شده
  const loadSelectedItem = React.useCallback(
    async (itemId: string) => {
      if (!itemId) {
        setSelectedItem(null)
        return
      }

      try {
        const params = new URLSearchParams({
          _id: itemId,
          limit: '1',
          ...fixedFilters,
        })

        const res = await getData(`${apiUrl}?${params.toString()}`)
        if (res?.[apiField]?.[0]) {
          setSelectedItem(res?.[apiField]?.[0])
        } else {
          // اگر آیتم پیدا نشد، مقدار رو پاک کن
          setSelectedItem(null)
        }
      } catch (error) {
        console.error('خطا در بارگذاری آیتم انتخاب شده:', error)
        setSelectedItem(null)
      }
    },
    [apiUrl, fixedFilters]
  )

  // بارگذاری اولیه فقط یک بار
  React.useEffect(() => {
    if (initialValue && !hasLoadedInitialRef.current) {
      hasLoadedInitialRef.current = true
      loadSelectedItem(initialValue)
    }
  }, [initialValue, loadSelectedItem])

  // وقتی initialValue تغییر کرد (مثلاً از بیرون)
  React.useEffect(() => {
    if (initialValue !== initialValueRef.current) {
      initialValueRef.current = initialValue
      setSelectedValue(initialValue || '')

      if (initialValue) {
        loadSelectedItem(initialValue)
      } else {
        setSelectedItem(null)
      }
    }
  }, [initialValue, loadSelectedItem])

  // تابع اصلی برای دریافت داده از API
  const fetchItems = async (query: string, pageNum: number, isNewSearch: boolean) => {
    if (!hasMore && pageNum > 1 && !isNewSearch) return

    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        ...(query && { [queryField]: query }),
        page: pageNum.toString(),
        limit: '20',
        ...fixedFilters,
      })

      const res = await getData(`${apiUrl}?${params.toString()}`)
      if (res?.ok === false) throw new Error('خطا در دریافت داده‌ها')

      const newItems = res?.[apiField] || []

      // اگر آیتم انتخاب شده در نتایج جدید است، آن را آپدیت کن
      if (selectedValue) {
        const foundItem = newItems.find((item) => item._id === selectedValue)
        if (foundItem && (!selectedItem || selectedItem._id !== selectedValue)) {
          setSelectedItem(foundItem)
        }
      }

      if (isNewSearch) {
        setItems(newItems)
      } else {
        setItems((prev) => [...prev, ...newItems])
      }

      setHasMore(pageNum < (res?.pagination?.pagesCount || 0))
      setPage(pageNum)
    } catch (error) {
      console.error('خطا در واکشی:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // استفاده از debounce برای جستجو
  React.useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
    }

    debounceTimeoutRef.current = setTimeout(() => {
      if (searchQuery.trim() !== '' || open) {
        fetchItems(searchQuery, 1, true)
      }
    }, 300)

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }
    }
  }, [searchQuery, open, apiUrl])

  // مدیریت اسکرول برای بارگذاری تدریجی
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget
    const isAtBottom = Math.abs(element.scrollHeight - element.scrollTop - element.clientHeight) < 10

    if (isAtBottom && hasMore && !isLoading) {
      fetchItems(searchQuery, page + 1, false)
    }
  }

  // مدیریت انتخاب یک آیتم
  const handleSelect = (currentValue: string) => {
    const selected = items.find((item) => item._id === currentValue)

    if (selected) {
      const newValue = currentValue === selectedValue ? '' : currentValue
      setSelectedValue(newValue)
      setSelectedItem(newValue ? selected : null)
      setOpen(false)
      setSearchQuery('')
      if (onValueChange) {
        onValueChange(newValue)
      }
    }
  }

  // وقتی Popover باز می‌شود، جستجو را پاک کن
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen)
    if (!isOpen) {
      setSearchQuery('')
    }
  }

  // پیدا کردن عنوان (label) برای مقدار انتخاب شده
  const selectedItemLabel = selectedItem?.[queryField] || placeholder

  return (
    <Popover
      open={open}
      onOpenChange={handleOpenChange}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          <span className="truncate">
            {selectedItemLabel}
            {selectedValue && !selectedItem && <span className="text-muted-foreground text-xs mr-2"> (در حال بارگذاری...)</span>}
          </span>
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
                      className={'cursor-pointer'}
                    >
                      <Check className={cn('ml-2 h-4 w-4', selectedValue === item._id ? 'opacity-100' : 'opacity-0')} />
                      {item?.[queryField]}
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
