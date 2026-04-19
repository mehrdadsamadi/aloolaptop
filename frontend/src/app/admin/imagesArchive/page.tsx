import LinkButton from '@/components/common/linkButton'
import AdminImagesArchive from './AdminImagesArchive'

export default async function AdminImagesArchivePage() {
  return (
    <section className="h-full">
      <div className={'flex items-center justify-between w-full mb-4 bg-gray-50 rounded-lg p-3'}>
        <h1 className="text-lg">آرشیو تصاویر</h1>
      </div>

      <AdminImagesArchive />
    </section>
  )
}
