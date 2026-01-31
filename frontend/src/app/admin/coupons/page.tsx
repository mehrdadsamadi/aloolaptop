import LinkButton from '@/components/common/linkButton'
import AdminCoupons from '@/app/admin/coupons/AdminCoupons'

export default async function AdminCouponsPage() {
  return (
    <section className="h-full">
      <div className={'flex items-center justify-between w-full mb-4 bg-gray-50 rounded-lg p-3'}>
        <h1 className="text-lg">لیست کوپن ها</h1>

        <LinkButton
          variant={'outline'}
          href="/admin/coupons/create"
        >
          ایجاد کوپن
        </LinkButton>
      </div>

      <AdminCoupons />
    </section>
  )
}
