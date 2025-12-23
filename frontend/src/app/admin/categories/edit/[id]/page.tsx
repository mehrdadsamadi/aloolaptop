import { getCategoryById } from '@/actions/category.action'
import EditCategory from '@/app/admin/categories/edit/[id]/EditCategory'

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const category = await getCategoryById(id)

  return <EditCategory category={category} />
}
