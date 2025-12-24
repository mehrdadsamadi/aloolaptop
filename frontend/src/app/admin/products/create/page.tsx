'use client'

import { ProductFormValues } from '@/validators/product.validator'
import ProductForm from '@/app/admin/products/_components/ProductForm'
import { createProduct } from '@/actions/product.action'
import { showError } from '@/lib/utils'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function CreateProductPage() {
  const router = useRouter()

  const handleSubmit = async (values: ProductFormValues, imageFiles?: File[]) => {
    try {
      // ارسال داده‌ها به API
      const formData = new FormData()

      // اضافه کردن داده‌های فرم
      Object.entries(values).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          if (typeof value === 'object') {
            formData.append(key, JSON.stringify(value))
          } else {
            formData.append(key, value.toString())
          }
        }
      })

      // اضافه کردن تصاویر
      if (imageFiles) {
        formData.delete('images')

        imageFiles.forEach((file, index) => {
          formData.append(`images`, file)
        })
      }

      const res = await createProduct(formData)

      if (res?.ok === false) {
        showError(res.messages)
        return
      }

      toast.success(res?.message || 'محصول با موفقیت ایجاد شد')
      router.push('/admin/products')
    } catch (error) {
      console.error('خطا در ایجاد محصول:', error)
      toast.error('خطا در ایجاد محصول')
    }
  }

  return <ProductForm onSubmit={handleSubmit} />
}
