// components/ui/image-upload.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Image as ImageIcon, Upload, X } from 'lucide-react'

interface ImageUploadProps {
  value?: File | string | null
  onChange: (value: File | null) => void
  maxSize?: number // in MB
  accept?: string
  className?: string
  disabled?: boolean
}

export function ImageUpload({ value, onChange, maxSize = 5, accept = 'image/*', className, disabled = false }: ImageUploadProps) {
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  // Sync preview with value
  useEffect(() => {
    if (value instanceof File) {
      // اگر value یک File باشد (حالت جدید)
      setSelectedFile(value)
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreview(e.target?.result as string)
      }
      reader.readAsDataURL(value)
    } else if (typeof value === 'string' && value) {
      // اگر value یک URL باشد (حالت ویرایش)
      setPreview(value)
    } else {
      // اگر خالی باشد
      setPreview(null)
      setSelectedFile(null)
    }
  }, [value])

  const validateFile = (file: File): boolean => {
    setError(null)

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
    const file = event.target.files?.[0]
    if (!file) return

    if (!validateFile(file)) {
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Set the file in state and notify parent
    setSelectedFile(file)
    onChange(file)

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleRemove = () => {
    setPreview(null)
    setSelectedFile(null)
    onChange(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()

    if (disabled) return

    const file = e.dataTransfer.files[0]
    if (file) {
      const event = {
        target: {
          files: [file],
        },
      } as unknown as React.ChangeEvent<HTMLInputElement>
      handleFileSelect(event)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div
        className={cn(
          'relative border-2 border-dashed rounded-lg p-6 transition-colors',
          'border-gray-300 dark:border-gray-700',
          'hover:border-primary/50 hover:bg-primary/5',
          disabled && 'opacity-50 cursor-not-allowed',
          error && 'border-destructive',
          !preview && 'min-h-[200px]'
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {preview ? (
          <div className="relative group">
            <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-900">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
            {!disabled && (
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={handleRemove}
                  className="opacity-100"
                >
                  <X className="w-4 h-4 ml-2" />
                  حذف تصویر
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="p-3 rounded-full bg-primary/10 mb-4">
              <ImageIcon className="w-8 h-8 text-primary" />
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">تصویر را اینجا رها کنید یا برای انتخاب کلیک کنید</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">فرمت‌های مجاز: JPG, PNG, WebP • حداکثر حجم: {maxSize}MB</p>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled}
            >
              <Upload className="w-4 h-4 ml-2" />
              انتخاب تصویر
            </Button>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled}
        />
      </div>

      {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg">{error}</div>}

      {!error && preview && selectedFile && (
        <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
          <div className="flex justify-between items-center">
            <span>فایل انتخاب شده:</span>
            <span className="font-medium">{selectedFile.name}</span>
          </div>
          <div className="flex justify-between items-center mt-1">
            <span>حجم:</span>
            <span
              dir={'ltr'}
              className="font-medium"
            >
              {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
            </span>
          </div>
        </div>
      )}

      {/*{!error && preview && !selectedFile && (*/}
      {/*  <div className="text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 p-3 rounded-lg">*/}
      {/*    تصویر قبلاً آپلود شده است*/}
      {/*  </div>*/}
      {/*)}*/}
    </div>
  )
}
