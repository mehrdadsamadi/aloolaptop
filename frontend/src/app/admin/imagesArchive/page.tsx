import AdminCategories from '@/app/admin/categories/AdminCategories'
import LinkButton from '@/components/common/linkButton'
import AdminImagesArchive from './AdminImagesArchive'

export default async function AdminImagesArchivePage() {
  return (
    <section className="h-full">
      <div className={'flex items-center justify-between w-full mb-4 bg-gray-50 rounded-lg p-3'}>
        <h1 className="text-lg">آرشیو تصاویر</h1>

        <LinkButton
          variant={'outline'}
          href="/admin/categories/create"
        >
          اضافه کردن تصویر
        </LinkButton>
      </div>

      <AdminImagesArchive />
    </section>
  )
}
