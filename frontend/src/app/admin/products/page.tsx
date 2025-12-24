import ButtonLink from '@/components/common/ButtonLink'
import AdminProducts from '@/app/admin/products/AdminProducts'

export default async function AdminProductsPage() {
  return (
    <section className="h-full">
      <div className={'flex items-center justify-between w-full mb-4 bg-gray-50 rounded-lg p-3'}>
        <h1 className="text-lg">لیست محصولات</h1>

        <ButtonLink
          variant={'outline'}
          href="/admin/products/create"
        >
          ایجاد محصول
        </ButtonLink>
      </div>

      <AdminProducts />
    </section>
  )
}
