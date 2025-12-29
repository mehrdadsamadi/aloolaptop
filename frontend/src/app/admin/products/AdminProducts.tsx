'use client'

import { useEffect, useState } from 'react'
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
import ButtonLink from '@/components/common/ButtonLink'
import { deleteProduct, getProductsList } from '@/actions/product.action'
import { IProduct } from '@/types/admin/product.type'
import { CONDITION_CONSTANTS } from '@/lib/constants/product.constant'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import ProductAttributesCell from '@/app/admin/products/_components/ProductAttributesCell'

export default function AdminProducts() {
  const { confirm } = useConfirm()

  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [products, setProducts] = useState<IProduct[] | null>(null)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)
  const [pagesCount, setPagesCount] = useState(1)

  const productColumns: ColumnDef<IProduct>[] = [
    {
      accessorKey: 'image',
      header: 'تصویر',
      cell: ({ row }) => (
        <Avatar>
          <AvatarImage src={getImageUrl(row.original?.images?.[0]?.url)} />
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
      accessorKey: 'categoryId',
      header: 'دسته بندی',
      cell: ({ row }) => row.original?.categoryId?.name ?? '—',
      enableSorting: true,
    },
    {
      accessorKey: 'condition',
      header: 'وضعیت محصول',
      cell: ({ row }) => CONDITION_CONSTANTS[row.original?.condition],
      enableSorting: true,
    },
    {
      accessorKey: 'grade',
      header: 'grade',
      cell: ({ row }) => (
        <p
          dir={'ltr'}
          className={'text-right'}
        >
          {row.original?.grade}
        </p>
      ),
      enableSorting: true,
    },
    {
      accessorKey: 'stock',
      header: 'تعداد',
      cell: ({ row }) => row.original?.stock,
      enableSorting: true,
    },
    {
      accessorKey: 'finalPrice',
      header: 'قیمت نهایی',
      cell: ({ row }) => (
        <Tooltip>
          <TooltipTrigger asChild>
            <p className={'cursor-default'}>{row.original?.finalPrice.toLocaleString()} تومان</p>
          </TooltipTrigger>
          <TooltipContent>
            <div className={'flex flex-col gap-3'}>
              <div className={'flex items-center justify-between gap-4'}>
                <p className={'text-right'}>قیمت :</p>
                <p className={'text-left'}>{row.original?.price.toLocaleString()} تومان</p>
              </div>
              <div className={'flex items-center justify-between gap-4'}>
                <p className={'text-right'}>درصد تخفیف :</p>
                <p className={'text-left'}>{row.original?.discountPercent} %</p>
              </div>
              <div className={'flex items-center justify-between gap-4'}>
                <p className={'text-right'}>انقضا تخفیف :</p>
                <p className={'text-left'}>{row.original?.discountExpiresAt ? formatPersianDate(row.original?.discountExpiresAt) : '—'}</p>
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      ),
      enableSorting: true,
    },
    {
      accessorKey: 'rate',
      header: 'امتیاز',
      cell: ({ row }) => row.original?.rate,
      enableSorting: true,
    },
    {
      accessorKey: 'attributes',
      header: 'ویژگی ها',
      cell: ({ row }) => <ProductAttributesCell attributes={row.original.attributes} />,
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
    // {
    //   accessorKey: 'createdAt',
    //   header: 'تاریخ ایجاد',
    //   cell: ({ row }) => formatPersianDate(row.original.createdAt),
    //   enableSorting: true,
    // },
    {
      id: 'actions',
      cell: ({ row }) => {
        return (
          <div className={'flex items-center gap-2'}>
            <ButtonLink
              size={'icon'}
              variant={'outline'}
              href={`/admin/products/edit/${row.original._id}`}
            >
              <PencilIcon />
            </ButtonLink>

            <Button
              variant="destructive"
              size="icon"
              loading={loadingId === row.original._id}
              onClick={() => {
                confirm({
                  title: 'حذف محصول',
                  description: `آیا از حذف محصول "${row.original?.name}" مطمئن هستید؟`,
                  confirmText: 'بله',
                  cancelText: 'لغو',
                  onConfirm: () => removeProduct(row.original._id),
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

  const productList = async () => {
    const res = await getProductsList({
      page,
      limit,
    })

    setProducts(res.products)

    setPagesCount(res?.pagination?.pagesCount)
  }

  useEffect(() => {
    productList()
  }, [page, limit])

  const removeProduct = async (productId: string) => {
    setLoadingId(productId)

    const response = await deleteProduct(productId)

    if (response?.ok === false) {
      toast.error(response.message)
      return
    }

    setProducts((prev) => {
      if (!prev) return prev

      return prev.filter((prd) => prd._id !== productId)
    })

    toast.success(response.message)

    setLoadingId(null)
  }

  return (
    <>
      {products === null ? (
        <LoadingSection />
      ) : products?.length === 0 ? (
        <NoData />
      ) : (
        <DataTable
          columns={productColumns}
          data={products}
          page={page}
          pageLimit={limit}
          pagesCount={pagesCount}
          onPageChange={(page: number) => setPage(page)}
        />
      )}
    </>
  )
}
