'use client'

import CategoryForm from '@/app/admin/categories/_components/CategoryForm'
import { createCategory } from '@/actions/category.action'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { CategoryFormValues } from '@/validators/category.validator'

export default function CreateCategoryPage() {
  const router = useRouter()

  const handleCreateCategory = async (data: CategoryFormValues) => {
    const res = await createCategory(data)

    if (res?.ok === false) {
      toast.error('مشکلی رخ داده است، مقادیر را بررسی کنید')

      return
    }

    toast.success(res?.message)

    router.push('/admin/categories')
  }

  return <CategoryForm onSubmit={handleCreateCategory} />
}
