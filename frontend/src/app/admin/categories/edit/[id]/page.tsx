import CategoryForm from '@/app/admin/categories/_components/CategoryForm'
import { getCategoryById } from '@/actions/category.action'

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const category = await getCategoryById(id)

  console.log('category', category)

  return (
    <CategoryForm
      isEdit
      // initialValues={mapCategoryToForm(category)}
      onSubmit={async (values) => {
        // await updateCategory(params.id, values)
        console.log('values', values)
      }}
    />
  )
}
