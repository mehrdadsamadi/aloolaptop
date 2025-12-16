import CategoriesPage from '@/app/admin/categories/CategoriesPage'

export default async function AdminUsersPage() {
  return (
    <section className="h-full">
      <h1 className="text-xl mb-4">لیست دسته بندی ها</h1>

      <CategoriesPage />
    </section>
  )
}
