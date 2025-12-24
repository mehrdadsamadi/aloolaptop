'use client'

import CategoryForm from '@/app/admin/categories/_components/CategoryForm'
import { ICategory } from '@/types/admin/category.type'
import { useRouter } from 'next/navigation'
import { CategoryFormValues } from '@/validators/category.validator'
import { updateCategory } from '@/actions/category.action'
import { showError } from '@/lib/utils'
import { toast } from 'sonner'

export default function EditCategory({ category }: { category: ICategory }) {
  const router = useRouter()

  const handleEditCategory = async (data: CategoryFormValues, imageFile?: File | null) => {
    try {
      // ایجاد FormData
      const formData = new FormData()

      // 1. اضافه کردن فایل تصویر (اگر وجود دارد)
      if (imageFile) {
        formData.append('image', imageFile)
      } else if (data.image) {
        // اگر در حالت ویرایش باشیم و image یک URL باشد
        formData.append('image', data.image)
      }

      // 2. اضافه کردن بقیه فیلدها
      formData.append('name', data.name)
      formData.append('slug', data.slug)
      formData.append('description', data.description || '')
      formData.append('isActive', String(data.isActive))
      formData.append('order', String(data.order))

      // parentId
      if (data.parentId) {
        formData.append('parentId', data.parentId)
      }

      // attributes
      if (data.attributes && data.attributes.length > 0) {
        formData.append('attributes', JSON.stringify(data.attributes))
      }

      // 3. فراخوانی action
      const res = await updateCategory(category?._id, formData)

      if (res?.ok === false) {
        showError(res.messages)
        return
      }

      toast.success(res?.message || 'دسته‌بندی با موفقیت ویرایش شد')
      router.push('/admin/categories')
    } catch (error) {
      console.error('Error creating category:', error)
      toast.error('خطا در ویرایش دسته‌بندی')
    }
  }

  return (
    <CategoryForm
      isEdit
      initialValues={category}
      onSubmit={handleEditCategory}
    />
  )
}
