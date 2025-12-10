'use client'
import DataTable from '@/components/common/dataTable'

export default function UsersPage() {
  const userColumns = [
    {
      accessorKey: 'firstName',
      header: 'نام',
      cell: ({ row }) => row.original.firstName,
    },
    {
      accessorKey: 'lastName',
      header: 'نام خانوادگی',
      cell: ({ row }) => row.original.lastName,
    },
    {
      accessorKey: 'mobile',
      header: 'موبایل',
    },
  ]
  const users = [
    { id: 1, firstName: 'مهدی', lastName: 'علیزاده', mobile: '09120000000' },
    { id: 2, firstName: 'محمد', lastName: 'قاسمی', mobile: '09124444444' },
  ]

  return (
    <div className="h-full">
      <h1 className="text-xl mb-4">لیست کاربران</h1>

      <DataTable
        columns={userColumns}
        data={users}
      />
    </div>
  )
}
