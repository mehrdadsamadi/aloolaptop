'use client'

import DataTable from '@/components/common/dataTable'
import { changeUserRole, getUsersList } from '@/actions/user.action'
import { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { formatPersianDate, getImageUrl } from '@/lib/utils'
import { ColumnDef } from '@tanstack/react-table'
import { IUser } from '@/types/admin/user.type'
import { ROLE_NAME_CONSTANTS } from '@/lib/constants/role.constant'
import { Roles } from '@/lib/enums/roles.enum'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { ChevronDown } from 'lucide-react'
import { toast } from 'sonner'
import LoadingSection from '@/components/common/loadingSection'
import { useConfirm } from '@/hooks/useConfirm'
import NoData from '@/components/common/noData'

export default function AdminUsers() {
  const { confirm } = useConfirm()

  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [users, setUsers] = useState<IUser[] | null>(null)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)
  const [pagesCount, setPagesCount] = useState(1)

  const userColumns: ColumnDef<IUser>[] = [
    {
      accessorKey: 'avatar',
      header: 'تصویر',
      cell: ({ row }) => (
        <Avatar>
          <AvatarImage src={getImageUrl(row.original.profile?.avatar?.url)} />
          <AvatarFallback>AV</AvatarFallback>
        </Avatar>
      ),
      enableSorting: false,
    },
    {
      accessorKey: 'firstName',
      header: 'نام',
      cell: ({ row }) => row.original.profile?.firstName,
      enableSorting: true,
    },
    {
      accessorKey: 'lastName',
      header: 'نام خانوادگی',
      cell: ({ row }) => row.original.profile?.lastName,
      enableSorting: true,
    },
    {
      accessorKey: 'mobile',
      header: 'موبایل',
      cell: ({ row }) => row.original.mobile,
      enableSorting: true,
    },
    {
      accessorKey: 'role',
      header: 'نقش',
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size={'sm'}
              variant="outline"
              className={'text-xs'}
              disabled={row.original.role === Roles.ADMIN}
              loading={loadingId === row.original._id}
            >
              {ROLE_NAME_CONSTANTS[(row.original.role as Roles) ?? Roles.BUYER]}
              <ChevronDown className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel dir={'rtl'}>نقش ها</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={row.original.role}
              onValueChange={(value: string) => {
                confirm({
                  title: 'تغییر نقش کاربر',
                  description: `آیا از تغییر نقش این کاربر به "${ROLE_NAME_CONSTANTS[value as Roles]}" مطمئن هستید؟`,
                  confirmText: 'بله، تغییر بده',
                  cancelText: 'لغو',
                  onConfirm: () => changeRole(row.original._id, value as Roles),
                })
              }}
              className={'space-y-2'}
              dir={'rtl'}
            >
              {Object.entries(ROLE_NAME_CONSTANTS).map(([key, value]) => (
                <DropdownMenuRadioItem
                  value={key}
                  key={key}
                  className={'cursor-pointer'}
                >
                  {value}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'تاریخ عضویت',
      cell: ({ row }) => formatPersianDate(row.original.createdAt),
      enableSorting: true,
    },
    // {
    //   id: 'actions',
    //   cell: ({ row }) => {
    //     const user = row.original
    //     return (
    //       <Button
    //         variant="outline"
    //         size="icon"
    //       >
    //         <CircleFadingArrowUpIcon />
    //       </Button>
    //     )
    //   },
    // },
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

  const changeRole = async (userId: string, role: Roles) => {
    setLoadingId(userId)

    const response = await changeUserRole(userId, role)

    setUsers((prevUsers) => {
      if (!prevUsers || !response?.user) return prevUsers

      return prevUsers.map((user) => (user._id === response.user._id ? { ...user, role } : user))
    })

    toast.success(response.message)

    setLoadingId(null)
  }

  return (
    <>
      {users === null ? (
        <LoadingSection />
      ) : users.length === 0 ? (
        <NoData />
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
