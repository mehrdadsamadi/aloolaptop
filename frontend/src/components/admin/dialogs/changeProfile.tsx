// app/admin/orders/_components/OrderItemsDialog.tsx
'use client'

import { Dialog } from '@/components/common/dialog'
import { Button } from '@/components/ui/button'
import { useUser } from '@/hooks/useUser'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ProfileFormValues, profileSchema } from '@/validators/profile.validator'
import { useEffect, useState } from 'react'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { ImageUpload } from '@/components/input/imageUpload'
import { toast } from 'sonner'
import { changeUserProfile } from '@/actions/user.action'
import { showError } from '@/lib/utils'

interface ChangeProfileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function ChangeProfileDialog({ open, onOpenChange }: ChangeProfileDialogProps) {
  const { user, saveUser } = useUser()

  const [loading, setLoading] = useState(false)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.profile?.firstName ?? '',
      lastName: user?.profile?.lastName ?? '',
      avatar: user?.profile?.avatar ?? '',
    },
  })

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form

  useEffect(() => {
    if (user) {
      form.reset({
        firstName: user?.profile?.firstName,
        lastName: user?.profile?.lastName,
        avatar: user?.profile?.avatar,
      })
    }
  }, [user])

  const handleFormSubmit = async (data: ProfileFormValues) => {
    try {
      setLoading(true)

      const formData = new FormData()

      if (avatarFile) {
        formData.append('avatar', avatarFile)
      }

      formData.append('firstName', String(data?.firstName))
      formData.append('lastName', String(data?.lastName))

      const res = await changeUserProfile(formData)

      if (res?.ok === false) {
        showError(res.messages)
        return
      }

      saveUser(res?.user)

      form.reset({
        firstName: res?.user?.profile?.firstName,
        lastName: res?.user?.profile?.lastName,
        avatar: res?.user?.profile?.avatar,
      })

      toast.success(res?.message || 'پروفایل با موفقیت ویرایش شد')

      onOpenChange(false)
    } catch (error) {
      console.log('error', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog
      title={'تغییر پروفایل'}
      description={'در این قسمت میتوانید اطلاعات پروفایل خود را تغییر دهید'}
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
            تایید
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
          <div className={'grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-2'}>
            <Controller
              name="firstName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-firstName">نام</FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-demo-firstName"
                    aria-invalid={fieldState.invalid}
                    placeholder="نام"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="lastName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-lastName">نام خانوادگی</FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-demo-lastName"
                    aria-invalid={fieldState.invalid}
                    placeholder="نام خانوادگی"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>

          <Controller
            name="avatar"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>آواتار</FieldLabel>
                <ImageUpload
                  value={avatarFile || field.value?.url} // ارسال فایل یا URL قبلی
                  onChange={(file) => {
                    if (file) {
                      // اگر فایل جدید انتخاب شده
                      setAvatarFile(file)
                      // فیلد image را خالی می‌کنیم چون فایل جدید داریم
                      field.onChange('')
                    } else {
                      // اگر تصویر حذف شده
                      setAvatarFile(null)
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
