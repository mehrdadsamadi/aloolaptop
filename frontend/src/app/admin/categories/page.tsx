import CategoriesPage from '@/app/admin/categories/CategoriesPage'
import Link from 'next/link'

export default async function AdminUsersPage() {
  return (
    <section className="h-full">
      <div className={'flex items-center justify-between w-full'}>
        <h1 className="text-xl mb-4">لیست دسته بندی ها</h1>

        {/*<Button asChild>*/}
        <Link href="/admin/categories/create">ایجاد دسته بندی</Link>
        {/*</Button>*/}
      </div>

      <CategoriesPage />
    </section>
  )
}
