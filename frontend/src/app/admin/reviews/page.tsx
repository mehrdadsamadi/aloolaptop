import AdminReviews from '@/app/admin/reviews/AdminReviews'

export default async function AdminReviewsPage() {
  return (
    <section className="h-full">
      <div className={'flex items-center justify-between w-full mb-4 bg-gray-50 rounded-lg p-3'}>
        <h1 className="text-lg">لیست دیدگاه ها و امتیاز ها</h1>
      </div>

      <AdminReviews />
    </section>
  )
}
