'use client'

import { deleteImageArchive, getImageArchiveList } from '@/actions/imageArchive.action'
import AddImageToArchiveDialog from '@/components/admin/dialogs/addImageToArchive'
import DataTable from '@/components/common/dataTable'
import LoadingSection from '@/components/common/loadingSection'
import NoData from '@/components/common/noData'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useConfirm } from '@/hooks/useConfirm'
import { formatPersianDate, getImageUrl } from '@/lib/utils'
import { IImageArchive } from '@/types/admin/imageArchive.type'
import { ColumnDef } from '@tanstack/react-table'
import { PlusIcon, Trash2Icon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export default function AdminImagesArchive() {
  const { confirm } = useConfirm()

  const [addImageArchiveDialog, setAddImageArchiveDialog] = useState(false)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [images, setImages] = useState<IImageArchive[] | null>(null)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)
  const [pagesCount, setPagesCount] = useState(1)

  //   TODO: روی تصویر که زد تصویر بزرگ باز بشه
  const imageColumns: ColumnDef<IImageArchive>[] = [
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
      accessorKey: 'title',
      header: 'عنوان',
      cell: ({ row }) => row.original?.title,
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
              variant="destructive"
              size="icon"
              loading={loadingId === row.original._id}
              onClick={() => {
                confirm({
                  title: 'حذف تصویر',
                  description: `آیا از حذف تصویر "${row.original?.title}" مطمئن هستید؟`,
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

  const iamgesList = async () => {
    const res = await getImageArchiveList({
      page,
      limit,
    })

    setImages(res.images)

    setPagesCount(res?.pagination?.pagesCount)
  }

  useEffect(() => {
    iamgesList()
  }, [page, limit])

  const removeProduct = async (imageId: string) => {
    setLoadingId(imageId)

    const response = await deleteImageArchive(imageId)

    if (response?.ok === false) {
      toast.error(response.message)
      return
    }

    setImages((prev) => {
      if (!prev) return prev

      return prev.filter((prd) => prd._id !== imageId)
    })

    toast.success(response.message)

    setLoadingId(null)
  }

  return (
    <section>
      <Button
        className="absolute top-21.75 left-7"
        variant={'outline'}
        onClick={() => {
          setAddImageArchiveDialog(true)
        }}
      >
        <PlusIcon className="h-4 w-4 ml-2" />
        افزودن تصویر جدید
      </Button>

      {images === null ? (
        <LoadingSection />
      ) : images?.length === 0 ? (
        <NoData />
      ) : (
        <DataTable
          columns={imageColumns}
          data={images}
          page={page}
          pageLimit={limit}
          pagesCount={pagesCount}
          onPageChange={(page: number) => setPage(page)}
        />
      )}

      <AddImageToArchiveDialog
        open={addImageArchiveDialog}
        onOpenChange={setAddImageArchiveDialog}
        onCompleteUpload={(image) => {
          setImages((prev) => (prev ? [image, ...prev] : [image]))
        }}
      />
    </section>
  )
}
