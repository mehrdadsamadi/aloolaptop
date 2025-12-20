'use client'

import CategoryForm from '@/app/admin/categories/_components/CategoryForm'

export default function CreateCategoryPage() {
  // const router = useRouter()

  return (
    <CategoryForm
      onSubmit={async (values) => {
        console.log('values', values)
        // await createCategory(values)
        // router.push('/admin/categories')
      }}
    />
  )
}
