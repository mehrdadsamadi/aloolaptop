'use client'

import { useRouter } from 'next/navigation'
import { showError } from '@/lib/utils'
import { toast } from 'sonner'
import ProductForm from '@/app/admin/products/_components/ProductForm'
import { ProductFormValues } from '@/validators/product.validator'
import { updateProduct } from '@/actions/product.action'
import { IProduct } from '@/types/admin/product.type'

export default function EditProduct({ product }: { product: IProduct }) {
  const router = useRouter()

  const handleEditProduct = async (values: ProductFormValues) => {
    try {

      const res = await updateProduct(product?._id, values)

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
        categoryId: product?.categoryId?._id
      }}
      onSubmit={handleEditProduct}
    />
  )
}
