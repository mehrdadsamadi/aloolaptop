// components/input/imagesUploader.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Image as ImageIcon, ImagePlus, X } from 'lucide-react'
import Image from 'next/image'

export interface ImageItem {
  id?: string
  url: string
  key?: string
  alt?: string
  file?: File
}

interface ImagesUploaderProps {
  value?: ImageItem[] // حالا هم فایل و هم URL می‌گیریم
  onChange: (images: ImageItem[]) => void
  maxFiles?: number
  maxSize?: number // در مگابایت
  accept?: string
  className?: string
  disabled?: boolean
}

export default function ImagesUploader({
  value = [],
  onChange,
  maxFiles = 10,
  maxSize = 5,
  accept = 'image/*',
  className,
  disabled = false,
}: ImagesUploaderProps) {
  const [error, setError] = useState<string | null>(null)
  const [images, setImages] = useState<ImageItem[]>(value)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Sync با prop value
  useEffect(() => {
    setImages(value || [])
  }, [value])

  const validateFile = (file: File): boolean => {
    // Check file type
    if (!file.type.startsWith('image/')) {
      setError('فایل باید تصویر باشد')
      return false
    }

    // Check file size
    const maxSizeBytes = maxSize * 1024 * 1024
    if (file.size > maxSizeBytes) {
      setError(`حجم فایل نباید بیشتر از ${maxSize} مگابایت باشد`)
      return false
    }

    return true
  }

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || [])

    if (selectedFiles.length === 0) return

    // بررسی تعداد فایل‌ها
    if (images.length + selectedFiles.length > maxFiles) {
      setError(`حداکثر ${maxFiles} تصویر می‌توانید آپلود کنید`)
      return
    }

    // اعتبارسنجی هر فایل
    const newImageItems: ImageItem[] = []
    for (const file of selectedFiles) {
      if (validateFile(file)) {
        // ایجاد URL برای پیش‌نمایش
        const previewUrl = URL.createObjectURL(file)
        newImageItems.push({
          url: previewUrl,
          file,
          alt: file.name,
        })
      } else {
        // اگر یک فایل نامعتبر باشد، کل عملیات متوقف شود
        return
      }
    }

    if (newImageItems.length === 0) return

    // اضافه کردن تصاویر جدید
    const newImages = [...images, ...newImageItems]
    setImages(newImages)
    onChange(newImages)
    setError(null)

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleRemove = (index: number) => {
    const newImages = [...images]
    // اگر فایل بود، URL رو revoke کن
    if (newImages[index].url.startsWith('blob:')) {
      URL.revokeObjectURL(newImages[index].url)
    }
    newImages.splice(index, 1)
    setImages(newImages)
    onChange(newImages)
    setError(null)
  }

  const handleRemoveAll = () => {
    // revoke همه URLهای blob
    images.forEach((img) => {
      if (img.url.startsWith('blob:')) {
        URL.revokeObjectURL(img.url)
      }
    })
    setImages([])
    onChange([])
    setError(null)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()

    if (disabled) return

    const droppedFiles = Array.from(e.dataTransfer.files)
    if (droppedFiles.length > 0) {
      const event = {
        target: {
          files: droppedFiles,
        },
      } as unknown as React.ChangeEvent<HTMLInputElement>
      handleFileSelect(event)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  // محاسبه حجم کل فایل‌ها
  const totalSize = images.reduce((total, img) => {
    if (img.file) {
      return total + img.file.size
    }
    return total
  }, 0)

  return (
    <div className={cn('space-y-4', className)}>
      {/* بخش آپلود */}
      <div
        className={cn(
          'relative border-2 border-dashed rounded-lg p-6 transition-colors',
          'border-gray-300 dark:border-gray-700',
          'hover:border-primary/50 hover:bg-primary/5',
          disabled && 'opacity-50 cursor-not-allowed',
          error && 'border-destructive'
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div className="flex flex-col items-center justify-center text-center">
          <div className="p-3 rounded-full bg-primary/10 mb-4">
            <ImageIcon className="w-8 h-8 text-primary" />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">تصاویر را اینجا رها کنید یا برای انتخاب کلیک کنید</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              فرمت‌های مجاز: JPG, PNG, WebP • حداکثر حجم: {maxSize}MB • حداکثر تعداد: {maxFiles}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {images.length} از {maxFiles} تصویر
            </p>
          </div>

          <div className={'flex gap-4 items-center mt-4'}>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled || images.length >= maxFiles}
            >
              <ImagePlus className="w-4 h-4 ml-2" />
              انتخاب تصاویر
            </Button>

            {images.length > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRemoveAll}
                disabled={disabled}
              >
                <X className="w-4 h-4 ml-2" />
                حذف همه تصاویر
              </Button>
            )}
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled}
        />
      </div>

      {/* نمایش خطا */}
      {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg">{error}</div>}

      {/* نمایش تصاویر */}
      {images.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">تصاویر ({images.length})</h4>
            <div className="text-sm text-gray-500">{images.filter((img) => img.file).length} تصویر جدید</div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {images.map((img, index) => (
              <div
                key={index}
                className="relative group"
              >
                <div className="aspect-square rounded-lg overflow-hidden border bg-gray-100 dark:bg-gray-900">
                  <Image
                    src={img.url}
                    alt={img.alt || `تصویر ${index + 1}`}
                    width={200}
                    height={200}
                    className="w-full h-full object-cover"
                    unoptimized={img?.url?.startsWith('blob:')} // فقط برای blobها unoptimized
                  />
                </div>

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex flex-col justify-between p-2">
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={() => handleRemove(index)}
                      disabled={disabled}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>

                  {img.file && (
                    <div className="text-white text-xs bg-black/70 p-1 rounded">
                      <div className="truncate">{img.file.name}</div>
                      <div
                        dir="ltr"
                        className="text-right"
                      >
                        {(img.file.size / (1024 * 1024)).toFixed(2)} MB
                      </div>
                    </div>
                  )}
                </div>

                <div className="text-xs text-center mt-1">
                  تصویر {index + 1}
                  {img.file && <span className="text-green-600 mr-1"> (جدید)</span>}
                </div>
              </div>
            ))}
          </div>

          {/* خلاصه اطلاعات */}
          {images.some((img) => img.file) && (
            <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span>تعداد تصاویر جدید:</span>
                  <span className="font-medium">{images.filter((img) => img.file).length} تصویر</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>حجم کل فایل‌های جدید:</span>
                  <span
                    dir="ltr"
                    className="font-medium"
                  >
                    {(totalSize / (1024 * 1024)).toFixed(2)} MB
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
