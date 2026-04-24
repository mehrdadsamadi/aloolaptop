'use client'

import { Dialog } from '@/components/common/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useEffect, useState, useMemo, useCallback, useRef } from 'react'
import { getImageUrl } from '@/lib/utils'
import { IImageArchive } from '@/types/admin/imageArchive.type'
import Image from 'next/image'
import { Search, Image as ImageIcon, Loader2, CheckCircle, X } from 'lucide-react'
import { toast } from 'sonner'
import { showError } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { getImageArchiveList } from '@/actions/imageArchive.action'

interface SelectImageFromArchiveDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectImage: (image: IImageArchive) => void
}

export default function SelectImageFromArchiveDialog({ open, onOpenChange, onSelectImage }: SelectImageFromArchiveDialogProps) {
  const [images, setImages] = useState<IImageArchive[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [selectedImage, setSelectedImage] = useState<IImageArchive | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [totalImages, setTotalImages] = useState(0)

  // رفر برای ذخیره تایمر دیبانس
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  // تابع دیبانس برای جستجو
  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value)

    // پاک کردن تایمر قبلی
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    // تنظیم تایمر جدید (500 میلی‌ثانیه تاخیر)
    debounceTimerRef.current = setTimeout(() => {
      setDebouncedSearchTerm(value)
      setPage(1) // ریست صفحه به اول
      setImages([]) // ریست تصاویر
      setHasMore(true) // ریست hasMore
    }, 500)
  }, [])

  // پاک کردن تایمر هنگام unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [])

  // بارگذاری تصاویر از سرور
  const fetchImages = async (currentPage: number, reset = false) => {
    try {
      if (reset) {
        setLoading(true)
      } else {
        setLoadingMore(true)
      }

      const res = await getImageArchiveList({ page: currentPage, limit: 20 }, debouncedSearchTerm || undefined)

      if (res?.ok === false) {
        showError(res.messages)
        return
      }

      // محاسبه hasMore بر اساس pagination دریافتی
      const currentPageNumber = res?.pagination?.page || currentPage
      const pagesCount = res?.pagination?.pagesCount || 1
      const hasMorePages = currentPageNumber < pagesCount

      if (reset) {
        setImages(res?.images || [])
        setTotalImages(res?.pagination?.total || 0)
      } else {
        setImages((prev) => [...prev, ...(res?.images || [])])
      }

      setHasMore(hasMorePages)
    } catch (error) {
      console.error('Error fetching images:', error)
      toast.error('خطا در بارگذاری تصاویر')
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  // بارگذاری اولیه و جستجو (با دیبانس)
  useEffect(() => {
    if (open) {
      setPage(1)
      setHasMore(true)
      setImages([])
      setTotalImages(0)
      fetchImages(1, true)
      setSelectedImage(null)
    }
  }, [open, debouncedSearchTerm])

  // بارگذاری صفحات بیشتر
  const loadMore = () => {
    if (!loadingMore && hasMore && !loading) {
      const nextPage = page + 1
      setPage(nextPage)
      fetchImages(nextPage, false)
    }
  }

  // فیلتر تصاویر بر اساس جستجو (سمت کلاینت برای جستجوی سریع‌تر)
  const filteredImages = useMemo(() => {
    if (!searchTerm) return images

    const searchLower = searchTerm.toLowerCase()
    return images.filter((image) => image.title.toLowerCase().includes(searchLower) || image._id.toLowerCase().includes(searchLower))
  }, [images, searchTerm])

  // انتخاب تصویر
  const handleSelectImage = (image: IImageArchive) => {
    setSelectedImage(image)
  }

  // تایید انتخاب
  const handleConfirmSelection = () => {
    if (selectedImage) {
      onSelectImage(selectedImage)
      onOpenChange(false)
      toast.success(`تصویر "${selectedImage.title}" با موفقیت انتخاب شد`)
    } else {
      toast.warning('لطفاً یک تصویر را انتخاب کنید')
    }
  }

  // پاک کردن جستجو
  const handleClearSearch = () => {
    setSearchTerm('')
    setDebouncedSearchTerm('')
    setPage(1)
    setImages([])
    setHasMore(true)
    fetchImages(1, true)
  }

  // اسکرول برای بارگذاری بیشتر
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget
    const bottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 100

    if (bottom && hasMore && !loadingMore && !loading) {
      loadMore()
    }
  }

  return (
    <Dialog
      title={'انتخاب تصویر از آرشیو'}
      description={'تصویر مورد نظر خود را از آرشیو جستجو و انتخاب کنید'}
      open={open}
      onOpenChange={onOpenChange}
      size="lg"
      showCloseButton={true}
      actions={
        <div className="flex items-center justify-between gap-4 w-full">
          <div className="flex items-center gap-2">
            <Button
              variant="default"
              onClick={handleConfirmSelection}
              disabled={!selectedImage}
              className="min-w-[100px]"
            >
              {selectedImage ? (
                <>
                  <CheckCircle className="ml-2 h-4 w-4" />
                  تایید انتخاب
                </>
              ) : (
                'انتخاب تصویر'
              )}
            </Button>

            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              انصراف
            </Button>
          </div>

          {selectedImage && (
            <Badge
              variant="secondary"
              className="text-sm"
            >
              تصویر انتخاب شده: {selectedImage.title}
            </Badge>
          )}
        </div>
      }
    >
      <div className="space-y-4">
        {/* باکس جستجو با دیبانس */}
        <div className="relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="جستجوی تصاویر بر اساس عنوان..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pr-10 pl-10"
          />
          {searchTerm && (
            <button
              onClick={handleClearSearch}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="پاک کردن جستجو"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* وضعیت جستجو */}
        {searchTerm !== debouncedSearchTerm && searchTerm && (
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Loader2 className="h-3 w-3 animate-spin" />
            <span>در حال جستجو...</span>
          </div>
        )}

        {/* تعداد نتایج */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            {loading
              ? 'در حال بارگذاری...'
              : debouncedSearchTerm
                ? `${filteredImages.length} نتیجه برای "${debouncedSearchTerm}"`
                : `${filteredImages.length} از ${totalImages} تصویر`}
          </span>
          {selectedImage && (
            <Badge
              variant="outline"
              className="text-xs"
            >
              {selectedImage.title}
            </Badge>
          )}
        </div>

        {/* گرید تصاویر */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="space-y-2"
              >
                <Skeleton className="h-32 w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
          </div>
        ) : filteredImages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">{debouncedSearchTerm ? 'نتیجه‌ای یافت نشد' : 'تصویری یافت نشد'}</p>
            {debouncedSearchTerm && (
              <p className="text-sm text-muted-foreground mt-2">برای عبارت "{debouncedSearchTerm}" نتیجه‌ای وجود ندارد</p>
            )}
            <Button
              variant="link"
              onClick={handleClearSearch}
              className="mt-4"
            >
              پاک کردن جستجو
            </Button>
          </div>
        ) : (
          <ScrollArea
            className="h-[500px] rounded-md border p-4 pt-3"
            onScrollCapture={handleScroll}
            dir="rtl"
          >
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-1">
              {filteredImages.map((image) => (
                <div
                  key={image._id}
                  className={`
                    group relative cursor-pointer rounded-lg border-2 transition-all duration-200
                    hover:shadow-lg hover:-translate-y-1
                    ${selectedImage?._id === image._id ? 'border-primary bg-primary/5 shadow-md' : 'border-border hover:border-primary/50'}
                  `}
                  onClick={() => handleSelectImage(image)}
                >
                  <div className="aspect-square relative overflow-hidden rounded-t-md bg-muted">
                    <Image
                      src={getImageUrl(image.image.url)}
                      alt={image.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    />

                    {/* نشانگر انتخاب */}
                    {selectedImage?._id === image._id && (
                      <div className="absolute top-2 left-2 bg-primary rounded-full p-1">
                        <CheckCircle className="h-4 w-4 text-white" />
                      </div>
                    )}

                    {/* اوورلای در هاور */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="text-xs"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleSelectImage(image)
                        }}
                      >
                        {selectedImage?._id === image._id ? 'انتخاب شده' : 'انتخاب'}
                      </Button>
                    </div>
                  </div>

                  <div className="p-3 text-right">
                    <p
                      className="text-sm font-medium truncate"
                      title={image.title}
                    >
                      {image.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{new Date(image.createdAt).toLocaleDateString('fa-IR')}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* ایندیکاتور بارگذاری بیشتر */}
            {loadingMore && (
              <div className="flex justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            )}

            {/* پایان لیست */}
            {!hasMore && filteredImages.length > 0 && filteredImages.length === totalImages && (
              <div className="text-center py-4 text-sm text-muted-foreground">✓ تمام {totalImages} تصویر نمایش داده شد</div>
            )}
          </ScrollArea>
        )}
      </div>
    </Dialog>
  )
}
