'use client'

import { Dialog } from '@/components/common/dialog'
import { getImageUrl } from '@/lib/utils'
import { IImageArchive } from '@/types/admin/imageArchive.type'
import Image from 'next/image'

interface ImagePreviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  imageData: IImageArchive | null
}

export default function ImagePreviewDialog({ open, onOpenChange, imageData }: ImagePreviewDialogProps) {
  return (
    <Dialog
      title={'پیش‌نمایش تصویر'}
      open={open}
      onOpenChange={onOpenChange}
      size="md"
      showCloseButton={true}
      showActions={false}
    >
      <Image
        src={getImageUrl(imageData?.image?.url)}
        alt={imageData?.title ? imageData.title : 'archive image'}
        className='w-full rounded-md'
        width={200}
        height={200}
      />
    </Dialog>
  )
}
