'use client'

import { useEffect, useState } from 'react'
import { ICategory } from '@/types/admin/category.type'
import { deleteCategory, getCategoriesList } from '@/actions/category.action'
import LoadingSection from '@/components/common/loadingSection'
import NoData from '@/components/common/noData'
import DataTable from '@/components/common/dataTable'
import { ColumnDef } from '@tanstack/react-table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { formatPersianDate, getImageUrl } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { PencilIcon, Trash2Icon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useConfirm } from '@/hooks/useConfirm'
import { toast } from 'sonner'
import CategoryAttributesCell from '@/app/admin/categories/_components/CategoryAttributesCell'

export default function CategoriesPage() {
  const { confirm } = useConfirm()

  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [categories, setCategories] = useState<ICategory[] | null>(null)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)
  const [pagesCount, setPagesCount] = useState(1)

  const categoryColumns: ColumnDef<ICategory>[] = [
    {
      accessorKey: 'order',
      header: 'ترتیب',
      cell: ({ row }) => row.original?.order,
      enableSorting: true,
    },
    {
      accessorKey: 'image',
      header: 'تصویر',
      cell: ({ row }) => (
        <Avatar>
          <AvatarImage src={getImageUrl(row.original?.image?.url)} />
          <AvatarFallback>IM</AvatarFallback>
        </Avatar>
      ),
      enableSorting: false,
    },
    {
      accessorKey: 'name',
      header: 'نام',
      cell: ({ row }) => row.original?.name,
      enableSorting: true,
    },
    {
      accessorKey: 'parentId',
      header: 'دسته بندی والد',
      cell: ({ row }) => row.original?.parent?.name ?? '—',
      enableSorting: true,
    },
    {
      accessorKey: 'slug',
      header: 'اسلاگ',
      cell: ({ row }) => <p className={'truncate max-w-[100px]'}>{row.original?.slug}</p>,
      enableSorting: true,
    },
    {
      accessorKey: 'description',
      header: 'توضیحات',
      cell: ({ row }) => <p className={'truncate max-w-[200px]'}>{row.original?.description}</p>,
      enableSorting: true,
    },
    {
      accessorKey: 'attributes',
      header: 'ویژگی ها',
      cell: ({ row }) => <CategoryAttributesCell attributes={row.original.attributes} />,
      enableSorting: true,
    },
    {
      accessorKey: 'isActive',
      header: 'وضعیت',
      cell: ({ row }) => (
        <Badge variant={row.original?.isActive ? 'default' : 'destructive'}>{row.original?.isActive ? 'فعال' : 'غیر فعال'}</Badge>
      ),
      enableSorting: true,
    },
    {
      accessorKey: 'createdAt',
      header: 'تاریخ ایجاد',
      cell: ({ row }) => formatPersianDate(row.original.createdAt),
      enableSorting: true,
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        return (
          <div className={'flex items-center gap-2'}>
            <Button
              variant="outline"
              size="icon"
            >
              <PencilIcon />
            </Button>

            <Button
              disabled={!row.original.isActive}
              variant="destructive"
              size="icon"
              loading={loadingId === row.original._id}
              onClick={() => {
                confirm({
                  title: 'حذف دسته بندی',
                  description: `آیا از حذف دسته بندی "${row.original?.name}" مطمئن هستید؟`,
                  confirmText: 'بله',
                  cancelText: 'لغو',
                  onConfirm: () => removeCategory(row.original._id),
                })
              }}
            >
              <Trash2Icon />
            </Button>
          </div>
        )
      },
    },
  ]

  const categoriesList = async () => {
    const res = await getCategoriesList({
      page,
      limit,
    })

    setCategories(res.categories)

    setPagesCount(res?.pagination?.pagesCount)
  }

  useEffect(() => {
    categoriesList()
  }, [page, limit])

  const removeCategory = async (categoryId: string) => {
    setLoadingId(categoryId)

    const response = await deleteCategory(categoryId)

    setCategories((prevCats) => {
      if (!prevCats || !response?.category) return prevCats

      return prevCats.map((cat) => (cat._id === response.category._id ? { ...cat, isActive: false } : cat))
    })

    toast.success(response.message)

    setLoadingId(null)
  }

  return (
    <>
      {categories === null ? (
        <LoadingSection />
      ) : categories.length === 0 ? (
        <NoData />
      ) : (
        <DataTable
          columns={categoryColumns}
          data={categories}
          page={page}
          pageLimit={limit}
          pagesCount={pagesCount}
          onPageChange={(page: number) => setPage(page)}
        />
      )}
    </>
  )
}
