import UsersPage from '@/app/admin/users/UsersPage'

export default async function AdminUsersPage() {
  return (
    <section className="h-full">
      <h1 className="text-xl mb-4">لیست کاربران</h1>

      <UsersPage />
    </section>
  )
}
