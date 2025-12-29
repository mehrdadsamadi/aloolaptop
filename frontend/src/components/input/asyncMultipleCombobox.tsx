'use client'

import * as React from 'react'
import { Check, ChevronsUpDown, Loader2, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import { getData } from '@/actions/helpers/fetchClient'

interface AsyncMultipleComboboxProps {
  apiUrl: string
  apiField: string
  queryField: string
  fixedFilters?: Record<string, string>
  initialValue?: string[]
  placeholder?: string
  onValueChange?: (values: string[]) => void
  maxSelections?: number
}

export function AsyncMultipleCombobox({
  apiUrl,
  apiField,
  queryField,
  fixedFilters = {},
  initialValue = [],
  placeholder = 'جستجو کنید...',
  onValueChange,
  maxSelections,
}: AsyncMultipleComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [selectedValues, setSelectedValues] = React.useState<string[]>(initialValue)
  const [selectedItems, setSelectedItems] = React.useState<Record<string, any>>({})
  const [searchQuery, setSearchQuery] = React.useState('')
  const [items, setItems] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [page, setPage] = React.useState(1)
  const [hasMore, setHasMore] = React.useState(true)

  const debounceTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)

  // استفاده از ref برای جلوگیری از رندرهای اضافی
  const initialValueRef = React.useRef<string[] | undefined>(initialValue)

  // تابع برای بارگذاری آیتم‌های انتخاب شده
  const loadSelectedItems = React.useCallback(
    async (itemIds: string[]) => {
      if (!itemIds.length) {
        setSelectedItems({})
        return
      }

      try {
        // بارگذاری آیتم‌های انتخاب شده که هنوز لود نشده‌اند
        const idsToLoad = itemIds.filter((id) => !selectedItems[id])

        if (idsToLoad.length > 0) {
          const params = new URLSearchParams({
            _ids: idsToLoad.join(','),
            limit: idsToLoad.length.toString(),
            ...fixedFilters,
          })

          const res = await getData(`${apiUrl}?${params.toString()}`)
          if (res?.[apiField]) {
            const newSelectedItems = { ...selectedItems }
            res[apiField].forEach((item: any) => {
              newSelectedItems[item._id] = item
            })
            setSelectedItems(newSelectedItems)
          }
        }
      } catch (error) {
        console.error('خطا در بارگذاری آیتم‌های انتخاب شده:', error)
      }
    },
    [apiUrl, fixedFilters, selectedItems]
  )

  // بارگذاری اولیه
  React.useEffect(() => {
    if (initialValue && initialValue.length > 0) {
      loadSelectedItems(initialValue)
    }
  }, [initialValue, loadSelectedItems])

  // وقتی initialValue تغییر کرد (مثلاً از بیرون)
  React.useEffect(() => {
    if (initialValue !== initialValueRef.current) {
      initialValueRef.current = initialValue
      setSelectedValues(initialValue || [])

      if (initialValue && initialValue.length > 0) {
        loadSelectedItems(initialValue)
      } else {
        setSelectedItems({})
      }
    }
  }, [initialValue, loadSelectedItems])

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

      // آپدیت آیتم‌های انتخاب شده اگر در نتایج جدید هستند
      const newSelectedItems = { ...selectedItems }
      let hasUpdates = false

      newItems.forEach((item: any) => {
        if (selectedValues.includes(item._id) && (!newSelectedItems[item._id] || newSelectedItems[item._id]._id !== item._id)) {
          newSelectedItems[item._id] = item
          hasUpdates = true
        }
      })

      if (hasUpdates) {
        setSelectedItems(newSelectedItems)
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

  // مدیریت انتخاب/حذف یک آیتم
  const handleSelect = (currentValue: string) => {
    const selected = items.find((item) => item._id === currentValue)

    if (selected) {
      let newValues: string[]

      if (selectedValues.includes(currentValue)) {
        // حذف آیتم
        newValues = selectedValues.filter((value) => value !== currentValue)
        const newSelectedItems = { ...selectedItems }
        delete newSelectedItems[currentValue]
        setSelectedItems(newSelectedItems)
      } else {
        // اضافه کردن آیتم (اگر محدودیتی وجود دارد چک کن)
        if (maxSelections && selectedValues.length >= maxSelections) {
          return
        }
        newValues = [...selectedValues, currentValue]
        const newSelectedItems = { ...selectedItems }
        newSelectedItems[currentValue] = selected
        setSelectedItems(newSelectedItems)
      }

      setSelectedValues(newValues)
      setOpen(true)
      if (onValueChange) {
        onValueChange(newValues)
      }
    }
  }

  // حذف یک آیتم انتخاب شده
  const handleRemove = (value: string, e: React.MouseEvent) => {
    e.stopPropagation()

    const newValues = selectedValues.filter((v) => v !== value)
    const newSelectedItems = { ...selectedItems }
    delete newSelectedItems[value]

    setSelectedValues(newValues)
    setSelectedItems(newSelectedItems)

    if (onValueChange) {
      onValueChange(newValues)
    }
  }

  // حذف همه آیتم‌های انتخاب شده
  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation()

    setSelectedValues([])
    setSelectedItems({})

    if (onValueChange) {
      onValueChange([])
    }
  }

  // وقتی Popover باز می‌شود، جستجو را پاک کن
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen)
    if (!isOpen) {
      setSearchQuery('')
    }
  }

  // نمایش آیتم‌های انتخاب شده
  const renderSelectedItems = () => {
    if (selectedValues.length === 0) {
      return <span className="text-muted-foreground">{placeholder}</span>
    }

    return (
      <div className="flex flex-wrap gap-1 max-w-full">
        {selectedValues.map((value) => (
          <Badge
            key={value}
            variant="secondary"
            className="pr-1 cursor-pointer"
            onClick={(e) => e.stopPropagation()}
          >
            {selectedItems[value]?.[queryField] || 'در حال بارگذاری...'}
            <div
              role={'button'}
              onClick={(e) => handleRemove(value, e)}
              className="mr-1 hover:text-destructive"
            >
              <X className="h-3 w-3" />
            </div>
          </Badge>
        ))}
      </div>
    )
  }

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
          className="w-full justify-between min-h-10"
        >
          <div className="flex-1 text-right truncate flex flex-wrap gap-1">{renderSelectedItems()}</div>
          <div className="flex items-center gap-1">
            {selectedValues.length > 0 && (
              <div
                role="button"
                onClick={handleClearAll}
                className="h-4 w-4 hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </div>
            )}
            <ChevronsUpDown className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-full p-0"
        align="start"
      >
        <Command shouldFilter={false}>
          <div className="px-3 py-2 border-b">
            <div className="text-xs text-muted-foreground">
              {selectedValues.length} آیتم انتخاب شده
              {maxSelections && ` (حداکثر ${maxSelections})`}
            </div>
          </div>
          <CommandInput
            placeholder="جستجو..."
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
                  {items.map((item) => {
                    const isSelected = selectedValues.includes(item._id)
                    const isDisabled = maxSelections ? selectedValues.length >= maxSelections && !isSelected : false

                    return (
                      <CommandItem
                        key={item._id}
                        value={item._id}
                        onSelect={() => !isDisabled && handleSelect(item._id)}
                        className={cn('cursor-pointer', isDisabled && 'opacity-50 cursor-not-allowed')}
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center">
                            <Check className={cn('ml-2 h-4 w-4', isSelected ? 'opacity-100' : 'opacity-0')} />
                            <span className={cn('truncate', isSelected && 'font-medium')}>{item?.[queryField]}</span>
                          </div>
                          {isDisabled && <span className="text-xs text-muted-foreground">حداکثر انتخاب</span>}
                        </div>
                      </CommandItem>
                    )
                  })}
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
