import AdminUsers from '@/app/admin/users/AdminUsers'

export default async function AdminUsersPage() {
  return (
    <section className="h-full">
      <div className={'flex items-center justify-between w-full mb-4 bg-gray-50 rounded-lg p-3'}>
        <h1 className="text-lg">لیست کاربران</h1>
      </div>

      <AdminUsers />
    </section>
  )
}
