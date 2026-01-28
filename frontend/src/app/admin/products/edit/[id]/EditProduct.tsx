'use client'

import { useRouter } from 'next/navigation'
import { showError } from '@/lib/utils'
import { toast } from 'sonner'
import ProductForm from '@/app/admin/products/_components/ProductForm'
import { ProductFormValues } from '@/validators/product.validator'
import { updateProduct } from '@/actions/product.action'
import { IProduct } from '@/types/admin/product.type'
import { ImageItem } from '@/components/input/imagesUploader'

export default function EditProduct({ product }: { product: IProduct }) {
  const router = useRouter()

  const handleEditProduct = async (values: ProductFormValues, imageFiles?: File[]) => {
    try {
      // ایجاد FormData جدید
      const formData = new FormData()

      // اضافه کردن فیلدهای اصلی (به جز images)
      Object.entries(values).forEach(([key, value]) => {
        if (key !== 'images' && value !== null && value !== undefined) {
          if (typeof value === 'object' && !(value instanceof Date)) {
            formData.append(key, JSON.stringify(value))
          } else if (value instanceof Date) {
            formData.append(key, value.toISOString())
          } else {
            formData.append(key, value.toString())
          }
        }
      })

      // اضافه کردن تصاویر قدیمی به صورت JSON
      if (values.images && values.images.length > 0) {
        const existingImages = values.images.filter((img: ImageItem) => img?.url && !img?.file && img?.key && img?.key?.length > 0)
        formData.append('existingImages', JSON.stringify(existingImages))
      }

      // اضافه کردن تصاویر جدید به صورت فایل
      if (imageFiles && imageFiles.length > 0) {
        imageFiles.forEach((file, index) => {
          formData.append(`images`, file) // نام فیلد متفاوت از existingImages
        })
      }

      const res = await updateProduct(product?._id, formData)

      if (res?.ok === false) {
        showError(res.messages)
        return
      }

      toast.success(res?.message || 'محصول با موفقیت ویرایش شد')
      router.push('/admin/products')
    } catch (error) {
      console.error('خطا در ویرایش محصول:', error)
      toast.error('خطا در ویرایش محصول')
    }
  }

  return (
    <ProductForm
      isEdit
      initialValues={{
        ...product,
        categoryId: product?.categoryId?._id,
        images: product.images || [],
      }}
      onSubmit={handleEditProduct}
    />
  )
}
