'use client'

import { Dialog } from '@/components/common/dialog'
import { Button } from '@/components/ui/button'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { ImageUpload } from '@/components/input/imageUpload'
import { toast } from 'sonner'
import { showError } from '@/lib/utils'
import { imageArchive, ImageArchiveFormValues } from '@/validators/imageArchive.validator'
import { addImageArchive } from '@/actions/imageArchive.action'
import { IImageArchive } from '@/types/admin/imageArchive.type'

interface AddImageToArchiveDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCompleteUpload: (image: IImageArchive) => void
}

export default function AddImageToArchiveDialog({ open, onOpenChange, onCompleteUpload }: AddImageToArchiveDialogProps) {
  const [loading, setLoading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)

  const form = useForm<ImageArchiveFormValues>({
    resolver: zodResolver(imageArchive),
    defaultValues: {
      title: '',
      image: '',
    },
  })

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form

  const handleFormSubmit = async (data: ImageArchiveFormValues) => {
    try {
      setLoading(true)

      const formData = new FormData()

      if (imageFile) {
        formData.append('image', imageFile)
      }

      formData.append('title', String(data?.title))

      const res = await addImageArchive(formData)

      // if (res?.ok === false) {
      //   showError(res.messages)
      //   return
      // }

      form.reset({
        title: '',
        image: '',
      })

      setImageFile(null)

      toast.success(res?.message || 'تصویر با موفقیت به آرشیو اضافه شد')

      onCompleteUpload(res?.image)

      onOpenChange(false)
    } catch (error) {
      console.log('error', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog
      title={'افزودن تصویر'}
      description={'در این قسمت میتوانید تصویری را به آرشیو تصاویر اضافه کنید'}
      open={open}
      onOpenChange={onOpenChange}
      size="md"
      showCloseButton={true}
      actions={
        <div className="flex items-center gap-4 w-full">
          <Button
            variant="default"
            onClick={handleSubmit(handleFormSubmit)}
            loading={loading}
          >
            افزودن
          </Button>

          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            loading={loading}
          >
            بستن
          </Button>
        </div>
      }
    >
      <form className={'flex flex-col gap-4 h-full justify-between'}>
        <FieldGroup>
          <Controller
            name="title"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-rhf-demo-firstName">عنوان</FieldLabel>
                <Input
                  {...field}
                  id="form-rhf-demo-title"
                  aria-invalid={fieldState.invalid}
                  placeholder="عنوان"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="image"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>تصویر</FieldLabel>
                <ImageUpload
                  value={imageFile || field.value?.url} // ارسال فایل یا URL قبلی
                  onChange={(file) => {
                    if (file) {
                      // اگر فایل جدید انتخاب شده
                      setImageFile(file)
                      // فیلد image را خالی می‌کنیم چون فایل جدید داریم
                      field.onChange('')
                    } else {
                      // اگر تصویر حذف شده
                      setImageFile(null)
                      field.onChange('')
                    }
                  }}
                  maxSize={5}
                  accept="image/*"
                  disabled={isSubmitting}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </FieldGroup>
      </form>
    </Dialog>
  )
}
