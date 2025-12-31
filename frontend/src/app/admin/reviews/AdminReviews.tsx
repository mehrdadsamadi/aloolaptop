'use client'

import DataTable from '@/components/common/dataTable'
import { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { formatPersianDate, getFullName, getImageUrl } from '@/lib/utils'
import { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { CircleCheckIcon, CircleSlashIcon, StarIcon } from 'lucide-react'
import { toast } from 'sonner'
import LoadingSection from '@/components/common/loadingSection'
import { useConfirm } from '@/hooks/useConfirm'
import NoData from '@/components/common/noData'
import { IReview } from '@/types/admin/review.type'
import { Badge } from '@/components/ui/badge'
import { changeVisibility, getReviewsList } from '@/actions/review.action'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

export default function AdminReviews() {
  const { confirm } = useConfirm()

  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [reviews, setReviews] = useState<IReview[] | null>(null)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)
  const [pagesCount, setPagesCount] = useState(1)

  const reviewColumns: ColumnDef<IReview>[] = [
    {
      accessorKey: 'userId',
      header: 'کاربر',
      cell: ({ row }) => (
        <div className={'flex items-center gap-2'}>
          <Avatar>
            <AvatarImage src={getImageUrl(row.original?.userId?.profile?.avatar?.url)} />
            <AvatarFallback>AV</AvatarFallback>
          </Avatar>
          <div className={'flex flex-col'}>
            <p>{getFullName(row.original?.userId?.profile)}</p>
            <p className={'text-xs'}>{row.original?.userId?.mobile}</p>
          </div>
        </div>
      ),
      enableSorting: false,
    },
    {
      accessorKey: 'productId',
      header: 'محصول',
      cell: ({ row }) => (
        <div className={'flex items-center gap-2'}>
          <Avatar>
            <AvatarImage src={getImageUrl(row.original?.productId?.images?.[0]?.url)} />
            <AvatarFallback>PR</AvatarFallback>
          </Avatar>
          <div className={'flex flex-col gap-1'}>
            <p>{row.original?.productId?.name}</p>
            <div className={'flex items-center gap-1'}>
              <StarIcon className={'size-5 text-yellow-500 pb-1'} />
              <p className={'text-xs'}>{row.original?.productId?.rate}</p>
            </div>
          </div>
        </div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: 'rating',
      header: 'امتیاز کاربر',
      cell: ({ row }) => row.original?.rating,
      enableSorting: true,
    },
    {
      accessorKey: 'comment',
      header: 'دیدگاه',
      cell: ({ row }) => (
        <Tooltip>
          <TooltipTrigger asChild>
            <p className={'truncate max-w-[200px] cursor-default'}>{row.original?.comment}</p>
          </TooltipTrigger>
          <TooltipContent>
            <p>{row.original?.comment}</p>
          </TooltipContent>
        </Tooltip>
      ),
      enableSorting: true,
    },
    {
      accessorKey: 'isVisible',
      header: 'قابل نمایش',
      cell: ({ row }) => (
        <div className={'flex items-center gap-2'}>
          <Badge variant={row.original?.isVisible ? 'default' : 'destructive'}>
            {row.original?.isVisible ? 'قابل نمایش' : 'غیر قابل نمایش'}
          </Badge>

          <Button
            size={'icon'}
            variant={'secondary'}
            loading={loadingId === row.original._id}
            onClick={() => {
              confirm({
                title: row.original?.isVisible ? 'غیر قابل نمایش' : 'قابل نمایش',
                description: `آیا از ${row.original?.isVisible ? 'غیر قابل نمایش' : 'قابل نمایش'} کردن دیدگاه مطمعن هستید؟`,
                confirmText: 'بله',
                cancelText: 'لغو',
                onConfirm: () => toggleVisibility(row.original._id),
              })
            }}
          >
            {row.original?.isVisible ? (
              <CircleCheckIcon className={'text-green-500 size-6'} />
            ) : (
              <CircleSlashIcon className={'text-red-500 size-6'} />
            )}
          </Button>
        </div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: 'createdAt',
      header: 'تاریخ',
      cell: ({ row }) => formatPersianDate(row.original.createdAt),
      enableSorting: true,
    },
  ]

  const reviewsList = async () => {
    const res = await getReviewsList({
      page,
      limit,
    })

    setReviews(res.reviews)

    setPagesCount(res?.pagination?.pagesCount)
  }

  useEffect(() => {
    reviewsList()
  }, [page, limit])

  const toggleVisibility = async (reviewId: string) => {
    setLoadingId(reviewId)

    const response = await changeVisibility(reviewId)

    if (response?.ok === false) {
      toast.error(response.message)
      return
    }

    setReviews((prev) => {
      if (!prev) return prev

      return prev.map((review) => (review._id === reviewId ? { ...review, isVisible: !review.isVisible } : review))
    })

    toast.success(response.message)

    setLoadingId(null)
  }

  return (
    <>
      {reviews === null ? (
        <LoadingSection />
      ) : reviews?.length === 0 ? (
        <NoData />
      ) : (
        <DataTable
          columns={reviewColumns}
          data={reviews}
          page={page}
          pageLimit={limit}
          pagesCount={pagesCount}
          onPageChange={(page: number) => setPage(page)}
        />
      )}
    </>
  )
}
