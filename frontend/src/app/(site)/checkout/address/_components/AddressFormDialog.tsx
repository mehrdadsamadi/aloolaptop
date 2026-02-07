// components/address/address-form-dialog.tsx
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Loader2, MapPin, Navigation } from 'lucide-react'
import { IAddress } from '@/types/admin/address.type'
import { toast } from 'sonner'
import { Label } from '@/components/ui/label'
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field'
import { AddressFormInput, addressFormSchema, AddressFormValues } from '@/validators/address.validator'
import { Dialog } from '@/components/common/dialog'
import dynamic from 'next/dynamic'
import { createAddress, updateAddress } from '@/actions/address.action'

const LocationSelectorDialog = dynamic(
  () => import('@/components/common/locationSelectorDialog').then((mod) => mod.LocationSelectorDialog),
  {
    ssr: false,
    loading: () => null,
  }
)

interface AddressFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  address?: IAddress | null
  onSuccess: () => void
}

export function AddressFormDialog({ open, onOpenChange, address, onSuccess }: AddressFormDialogProps) {
  const [mapDialogOpen, setMapDialogOpen] = useState(false)
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const [hasCoordinates, setHasCoordinates] = useState(false)

  const form = useForm<AddressFormInput>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: {
      title: '',
      state: '',
      city: '',
      postalCode: '',
      address: '',
      latitude: '35.6892',
      longitude: '51.3890',
      isDefault: false,
    },
    mode: 'onChange',
  })

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    trigger,
    formState: { isSubmitting, errors, isValid, isDirty },
  } = form

  // مشاهده مقادیر مختصات
  const latitude = watch('latitude')
  const longitude = watch('longitude')

  // بررسی اینکه آیا مختصات معتبر داریم یا نه
  useEffect(() => {
    try {
      const lat = parseFloat(latitude)
      const lng = parseFloat(longitude)
      const hasValidCoords = !isNaN(lat) && !isNaN(lng) && lat >= 25 && lat <= 40 && lng >= 44 && lng <= 63
      setHasCoordinates(hasValidCoords)
    } catch {
      setHasCoordinates(false)
    }
  }, [latitude, longitude])

  // وقتی آدرس برای ویرایش وارد می‌شود، فرم را پر کن
  useEffect(() => {
    if (address) {
      const lat = address.location?.coordinates[1]?.toString() || '35.6892'
      const lng = address.location?.coordinates[0]?.toString() || '51.3890'

      reset({
        title: address.title || '',
        state: address.state || '',
        city: address.city || '',
        postalCode: address.postalCode || '',
        address: address.address || '',
        latitude: lat,
        longitude: lng,
        isDefault: address.isDefault || false,
      })

      // بررسی اعتبار مختصات
      try {
        const latNum = parseFloat(lat)
        const lngNum = parseFloat(lng)
        setHasCoordinates(!isNaN(latNum) && !isNaN(lngNum))
      } catch {
        setHasCoordinates(false)
      }
    } else {
      reset({
        title: '',
        state: '',
        city: '',
        postalCode: '',
        address: '',
        latitude: '35.6892',
        longitude: '51.3890',
        isDefault: false,
      })
      setHasCoordinates(true) // تهران معتبر است
    }
  }, [address, reset, open])

  // این تابع فرم را validate می‌کند و data را به فرمت API تبدیل می‌کند
  const processFormData = async (data: AddressFormInput): Promise<AddressFormValues> => {
    // اعتبارسنجی با schema
    const validatedData = addressFormSchema.parse(data)

    // تبدیل به فرمت API
    return {
      title: validatedData.title,
      state: validatedData.state,
      city: validatedData.city,
      postalCode: validatedData.postalCode,
      address: validatedData.address,
      latitude: parseFloat(validatedData.latitude),
      longitude: parseFloat(validatedData.longitude),
      isDefault: validatedData.isDefault,
    }
  }

  const onSubmit = async (data: AddressFormInput) => {
    try {
      // پردازش و تبدیل داده‌های فرم
      const apiData = await processFormData(data)

      let res
      if (address) {
        res = await updateAddress(address._id, apiData)
      } else {
        res = await createAddress(apiData)
      }

      if (res?.address) {
        toast.success(res?.message || 'عملیات موفق بود')
        onSuccess()
        onOpenChange(false)
        reset()
      } else {
        throw new Error(res?.message || 'خطایی رخ داد')
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
      toast.error('مرورگر شما از موقعیت جغرافیایی پشتیبانی نمی‌کند')
      return
    }

    setIsGettingLocation(true)
    toast.info('در حال دریافت موقعیت...')

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude
        const lng = position.coords.longitude

        setValue('latitude', lat.toFixed(6), { shouldValidate: true })
        setValue('longitude', lng.toFixed(6), { shouldValidate: true })
        setIsGettingLocation(false)

        // اعتبارسنجی فیلدها
        trigger(['latitude', 'longitude'])

        toast.success('موقعیت جغرافیایی با موفقیت دریافت شد')
      },
      (error) => {
        setIsGettingLocation(false)

        let errorMessage = 'خطا در دریافت موقعیت'
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'دسترسی به موقعیت جغرافیایی رد شد. لطفاً در تنظیمات مرورگر اجازه دهید.'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'اطلاعات موقعیت در دسترس نیست'
            break
          case error.TIMEOUT:
            errorMessage = 'دریافت موقعیت زمان‌بر شد'
            break
        }

        toast.error(errorMessage)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    )
  }

  const handleMapLocationSelect = (lat: number, lng: number) => {
    setValue('latitude', lat.toFixed(6), { shouldValidate: true })
    setValue('longitude', lng.toFixed(6), { shouldValidate: true })
    trigger(['latitude', 'longitude'])
  }

  // مختصات اولیه برای نقشه
  const getInitialCoordinates = () => {
    try {
      const lat = parseFloat(latitude)
      const lng = parseFloat(longitude)

      if (!isNaN(lat) && !isNaN(lng)) {
        return { lat, lng }
      }
    } catch {
      // ignore
    }

    // مختصات پیش‌فرض تهران
    return {
      lat: 35.6892,
      lng: 51.389,
    }
  }

  const initialCoords = getInitialCoordinates()

  // بررسی اینکه آیا فرم قابل submit است
  const canSubmit = isValid && hasCoordinates

  return (
    <>
      <Dialog
        title={address ? 'ویرایش آدرس' : 'ثبت آدرس جدید'}
        open={open}
        onOpenChange={(newOpen) => {
          if (!newOpen) {
            reset()
          }
          onOpenChange(newOpen)
        }}
        size="lg"
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
              type="button"
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting || !canSubmit}
            >
              {isSubmitting && <Loader2 className="h-4 w-4 ml-2 animate-spin" />}
              {address ? 'ویرایش آدرس' : 'ثبت آدرس'}
            </Button>
          </>
        }
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={'max-h-125 overflow-y-auto'}
        >
          <div className={'flex flex-col gap-6 px-1'}>
            {/* ردیف اول: عنوان و کد پستی */}
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

            {/* ردیف دوم: استان و شهر */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            {/* بخش مختصات جغرافیایی */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <FieldLabel>موقعیت جغرافیایی *</FieldLabel>
                  {!hasCoordinates && <p className="text-xs text-destructive mt-1">لطفاً موقعیت جغرافیایی معتبر انتخاب کنید</p>}
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setMapDialogOpen(true)}
                  >
                    <MapPin className="h-4 w-4 ml-2" />
                    انتخاب روی نقشه
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleGetCurrentLocation}
                    disabled={isGettingLocation}
                  >
                    {isGettingLocation ? <Loader2 className="h-4 w-4 ml-2 animate-spin" /> : <Navigation className="h-4 w-4 ml-2" />}
                    موقعیت فعلی
                  </Button>
                </div>
              </div>

              {/* نمایش مختصات فعلی */}
              <div
                className={`p-3 rounded-lg border ${hasCoordinates ? 'bg-green-50 border-green-200' : 'bg-destructive/10 border-destructive/20'}`}
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label
                      htmlFor="latitude-display"
                      className="text-xs text-muted-foreground"
                    >
                      عرض جغرافیایی
                    </Label>
                    <div className="mt-1 p-2 bg-background rounded border font-mono text-sm">{latitude || '--'}</div>
                  </div>
                  <div>
                    <Label
                      htmlFor="longitude-display"
                      className="text-xs text-muted-foreground"
                    >
                      طول جغرافیایی
                    </Label>
                    <div className="mt-1 p-2 bg-background rounded border font-mono text-sm">{longitude || '--'}</div>
                  </div>
                </div>
                <p className={`text-xs mt-2 ${hasCoordinates ? 'text-green-600' : 'text-destructive'}`}>
                  {hasCoordinates ? 'موقعیت جغرافیایی معتبر است' : 'موقعیت جغرافیایی نامعتبر است. لطفاً موقعیت جدید انتخاب کنید'}
                </p>
              </div>

              {/* اطلاعات موقعیت */}
              {hasCoordinates && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-medium text-blue-700">موقعیت فعلی روی نقشه ثبت شده است</p>
                      <p className="text-blue-600 mt-1">برای تغییر موقعیت، روی دکمه &#34;انتخاب روی نقشه&#34; کلیک کنید</p>
                    </div>
                  </div>
                </div>
              )}

              {/* فیلدهای مخفی برای فرم (مقادیر واقعی) */}
              <Controller
                name="latitude"
                control={control}
                render={({ field }) => (
                  <input
                    type="hidden"
                    {...field}
                    value={field.value || ''}
                  />
                )}
              />
              <Controller
                name="longitude"
                control={control}
                render={({ field }) => (
                  <input
                    type="hidden"
                    {...field}
                    value={field.value || ''}
                  />
                )}
              />
            </div>

            {/* آدرس پیش‌فرض */}
            <Controller
              name="isDefault"
              control={control}
              render={({ field }) => (
                <div className="flex items-start justify-between p-4 bg-muted/30 rounded-lg">
                  <div className="space-y-2">
                    <Label
                      htmlFor="isDefault"
                      className="font-medium"
                    >
                      تعیین به عنوان آدرس پیش‌فرض
                    </Label>
                    <p className="text-xs text-muted-foreground">این آدرس به طور پیش‌فرض برای سفارش‌های بعدی استفاده می‌شود</p>
                  </div>
                  <Switch
                    dir={'ltr'}
                    className={'cursor-pointer'}
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
          </div>
        </form>
      </Dialog>

      {/* دیالوگ انتخاب موقعیت روی نقشه */}
      <LocationSelectorDialog
        open={mapDialogOpen}
        onOpenChange={setMapDialogOpen}
        initialLatitude={initialCoords.lat}
        initialLongitude={initialCoords.lng}
        onLocationSelect={handleMapLocationSelect}
      />
    </>
  )
}
