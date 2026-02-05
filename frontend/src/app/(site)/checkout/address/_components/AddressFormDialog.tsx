// components/address/address-form-dialog.tsx
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Loader2 } from 'lucide-react'
import { IAddress } from '@/types/admin/address.type'
import { toast } from 'sonner'
import { Label } from '@/components/ui/label'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { AddressFormInput, addressSchema } from '@/validators/address.validator'
import { Dialog } from '@/components/common/dialog'

interface AddressFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  address?: IAddress | null
  onSuccess: () => void
}

export function AddressFormDialog({ open, onOpenChange, address, onSuccess }: AddressFormDialogProps) {
  const form = useForm<AddressFormInput>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      title: '',
      state: '',
      city: '',
      postalCode: '',
      address: '',
      latitude: '',
      longitude: '',
      isDefault: false,
    },
    mode: 'onChange',
  })

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting, errors, isValid },
  } = form

  // وقتی آدرس برای ویرایش وارد می‌شود، فرم را پر کن
  useEffect(() => {
    if (address) {
      reset({
        title: address.title || '',
        state: address.state || '',
        city: address.city || '',
        postalCode: address.postalCode || '',
        address: address.address || '',
        latitude: address.location?.coordinates[1]?.toString() || '',
        longitude: address.location?.coordinates[0]?.toString() || '',
        isDefault: address.isDefault || false,
      })
    } else {
      reset({
        title: '',
        state: '',
        city: '',
        postalCode: '',
        address: '',
        latitude: '',
        longitude: '',
        isDefault: false,
      })
    }
  }, [address, reset, open])

  const onSubmit = async (data: AddressFormInput) => {
    try {
      // تبدیل داده‌های فرم به فرمت API
      const apiData = {
        ...data,
        latitude: data.latitude ? parseFloat(data.latitude) : 0,
        longitude: data.longitude ? parseFloat(data.longitude) : 0,
      }

      const url = address ? `/api/user/addresses/${address._id}` : '/api/user/addresses'
      const method = address ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiData),
      })

      const result = await response.json()

      if (response.ok) {
        toast.success(address ? 'آدرس با موفقیت ویرایش شد' : 'آدرس جدید با موفقیت ثبت شد')
        onSuccess()
        onOpenChange(false)
        reset()
      } else {
        throw new Error(result.message || 'خطایی در ثبت آدرس رخ داد')
      }
    } catch (error) {
      toast.error('خطا', {
        description: error instanceof Error ? error.message : 'خطایی در ثبت آدرس رخ داد',
      })
    }
  }

  // استفاده از موقعیت جغرافیایی کاربر
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('خطا', {
        description: 'مرورگر شما از موقعیت جغرافیایی پشتیبانی نمی‌کند',
      })
      return
    }

    toast.info('در حال دریافت موقعیت...')

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude
        const lng = position.coords.longitude

        setValue('latitude', lat.toFixed(6), { shouldValidate: true })
        setValue('longitude', lng.toFixed(6), { shouldValidate: true })

        toast.success('موقعیت جغرافیایی با موفقیت دریافت شد')
      },
      (error) => {
        toast.error('خطا در دریافت موقعیت', {
          description: error.message,
        })
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  return (
    <Dialog
      title={address ? 'ویرایش آدرس' : 'ثبت آدرس جدید'}
      open={open}
      onOpenChange={(newOpen) => {
        if (!newOpen) {
          reset()
        }
        onOpenChange(newOpen)
      }}
      size="md"
      actions={
        <>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              reset()
              onOpenChange(false)
            }}
            disabled={isSubmitting}
          >
            انصراف
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || !isValid}
          >
            {isSubmitting && <Loader2 className="h-4 w-4 ml-2 animate-spin" />}
            {address ? 'ویرایش آدرس' : 'ثبت آدرس'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup className="space-y-4">
          {/* ردیف اول: عنوان و استان */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="title"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="title">عنوان آدرس *</FieldLabel>
                  <Input
                    {...field}
                    id="title"
                    aria-invalid={fieldState.invalid}
                    placeholder="مثلاً: خانه، محل کار"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="state"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="state">استان *</FieldLabel>
                  <Input
                    {...field}
                    id="state"
                    aria-invalid={fieldState.invalid}
                    placeholder="نام استان"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>

          {/* ردیف دوم: شهر و کد پستی */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="city"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="city">شهر *</FieldLabel>
                  <Input
                    {...field}
                    id="city"
                    aria-invalid={fieldState.invalid}
                    placeholder="نام شهر"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="postalCode"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="postalCode">کد پستی *</FieldLabel>
                  <Input
                    {...field}
                    id="postalCode"
                    aria-invalid={fieldState.invalid}
                    placeholder="۱۰ رقمی"
                    maxLength={10}
                    inputMode="numeric"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  <FieldDescription>کد پستی باید دقیقاً ۱۰ رقم باشد</FieldDescription>
                </Field>
              )}
            />
          </div>

          {/* ردیف سوم: مختصات جغرافیایی */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="latitude"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="latitude">عرض جغرافیایی</FieldLabel>
                  <div className="flex gap-2">
                    <Input
                      {...field}
                      id="latitude"
                      aria-invalid={fieldState.invalid}
                      placeholder="مثلاً: 35.6892"
                      type="number"
                      step="any"
                      value={field.value || ''}
                    />
                  </div>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="longitude"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="longitude">طول جغرافیایی</FieldLabel>
                  <div className="flex gap-2">
                    <Input
                      {...field}
                      id="longitude"
                      aria-invalid={fieldState.invalid}
                      placeholder="مثلاً: 51.3890"
                      type="number"
                      step="any"
                      value={field.value || ''}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleGetCurrentLocation}
                      title="استفاده از موقعیت فعلی"
                    >
                      📍
                    </Button>
                  </div>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>

          {/* آدرس کامل */}
          <Controller
            name="address"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="address">آدرس کامل *</FieldLabel>
                <Textarea
                  {...field}
                  id="address"
                  aria-invalid={fieldState.invalid}
                  placeholder="خیابان، کوچه، پلاک، واحد"
                  rows={3}
                  className="resize-none"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                <FieldDescription>آدرس را دقیق و کامل وارد کنید تا پیک بتواند به راحتی پیدا کند</FieldDescription>
              </Field>
            )}
          />

          {/* آدرس پیش‌فرض */}
          <Controller
            name="isDefault"
            control={control}
            render={({ field }) => (
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div className="space-y-0.5">
                  <Label
                    htmlFor="isDefault"
                    className="font-medium"
                  >
                    تعیین به عنوان آدرس پیش‌فرض
                  </Label>
                  <p className="text-sm text-muted-foreground">این آدرس به طور پیش‌فرض برای سفارش‌های بعدی استفاده می‌شود</p>
                </div>
                <Switch
                  id="isDefault"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </div>
            )}
          />

          {/* نمایش خطاهای کلی فرم */}
          {Object.keys(errors).length > 0 && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm font-medium text-destructive">لطفاً خطاهای زیر را اصلاح کنید:</p>
              <ul className="mt-2 text-sm text-destructive list-disc list-inside space-y-1">
                {Object.entries(errors).map(([key, error]) => (
                  <li key={key}>{typeof error?.message === 'string' ? error.message : 'خطای نامشخص'}</li>
                ))}
              </ul>
            </div>
          )}
        </FieldGroup>
      </form>
    </Dialog>
  )
}
