import AdminCategories from '@/app/admin/categories/AdminCategories'
import LinkButton from '@/components/common/linkButton'

export default async function AdminCategoriesPage() {
  return (
    <section className="h-full">
      <div className={'flex items-center justify-between w-full mb-4 bg-gray-50 rounded-lg p-3'}>
        <h1 className="text-lg">لیست دسته بندی ها</h1>

        <LinkButton
          variant={'outline'}
          href="/admin/categories/create"
        >
          ایجاد دسته بندی
        </LinkButton>
      </div>

      <AdminCategories />
    </section>
  )
}
