'use client'
import DataTable from '@/components/common/dataTable'
import { getUsersList } from '@/actions/user.action'
import { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { formatPersianDate } from '@/lib/utils'

export default function UsersPage() {
  const [users, setUsers] = useState<any[] | null>(null)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)
  const [pagesCount, setPagesCount] = useState(1)

  const userColumns = [
    {
      accessorKey: 'avatar',
      header: 'تصویر',
      cell: ({ row }) => (
        <Avatar>
          <AvatarImage src={row.original.profile?.avatar?.url ?? '/images/image-placeholder.jpeg'} />
          <AvatarFallback>AV</AvatarFallback>
        </Avatar>
      ),
    },
    {
      accessorKey: 'firstName',
      header: 'نام',
      cell: ({ row }) => row.original.profile?.firstName,
    },
    {
      accessorKey: 'lastName',
      header: 'نام خانوادگی',
      cell: ({ row }) => row.original.profile?.lastName,
    },
    {
      accessorKey: 'mobile',
      header: 'موبایل',
      cell: ({ row }) => row.original.mobile,
    },
    {
      accessorKey: 'createdAt',
      header: 'تاریخ عضویت',
      cell: ({ row }) => formatPersianDate(row.original.createdAt),
    },
  ]

  const usersList = async () => {
    const res = await getUsersList({
      page,
      limit,
    })

    setUsers(res.users)

    setPagesCount(res?.pagination?.pagesCount)
  }

  useEffect(() => {
    usersList()
  }, [page, limit])

  return (
    <>
      {users === null ? (
        <div>null</div>
      ) : (
        <DataTable
          columns={userColumns}
          data={users}
          page={page}
          pageLimit={limit}
          pagesCount={pagesCount}
          onPageChange={(page: number) => setPage(page)}
        />
      )}
    </>
  )
}
