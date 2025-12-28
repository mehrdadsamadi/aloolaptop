'use client'

import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { useEffect, useState } from 'react'
import { CouponFormValues, couponSchema } from '@/validators/coupon.validator'
import { Badge } from '@/components/ui/badge'
import { CalendarIcon, X } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CouponType, DiscountMethod } from '@/types/admin/coupon.type'
import { NumberInput } from '@/components/input/numberInput'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn, formatPersianDate } from '@/lib/utils'
import { Calendar } from '@/components/ui/calendar'
import { AsyncCombobox } from '@/components/input/asyncCombobox'

interface Props {
  initialValues?: CouponFormValues
  onSubmit: (values: CouponFormValues) => Promise<void>
  isEdit?: boolean
}

export default function CouponForm({ initialValues, onSubmit, isEdit }: Props) {
  const [selectedProducts, setSelectedProducts] = useState<string[]>(initialValues?.productIds || [])

  const form = useForm<CouponFormValues>({
    resolver: zodResolver(couponSchema),
    defaultValues: initialValues ?? {
      code: '',
      type: CouponType.CART,
      method: DiscountMethod.PERCENT,
      value: 0,
      productIds: [],
      minOrderAmount: null,
      maxUses: 1,
      startDate: new Date(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 30)),
    },
  })

  const {
    handleSubmit,
    control,
    watch,
    setValue,
    clearErrors,
    formState: { isSubmitting },
  } = form

  const couponType = watch('type')
  const discountMethod = watch('method')

  // وقتی کوپن نوعش عوض می‌شود، مقادیر مرتبط را پاک کن
  useEffect(() => {
    if (couponType === CouponType.CART) {
      setValue('productIds', [])
      setSelectedProducts([])
      clearErrors('productIds')
    } else {
      setValue('minOrderAmount', null)
      clearErrors('minOrderAmount')
    }
  }, [couponType, setValue, clearErrors])

  // وقتی محصول‌ها تغییر می‌کنند، مقدار form را به‌روز کن
  useEffect(() => {
    setValue('productIds', selectedProducts, { shouldValidate: true })
  }, [selectedProducts, setValue])

  // حذف یک محصول از لیست انتخاب شده
  const removeProduct = (productId: string) => {
    setSelectedProducts(selectedProducts.filter((id) => id !== productId))
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6 h-full justify-between"
    >
      <FieldGroup className="space-y-6">
        {/* ردیف اول: کد کوپن و نوع کوپن */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Controller
            name="code"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="coupon-code">کد تخفیف</FieldLabel>
                <Input
                  {...field}
                  id="coupon-code"
                  aria-invalid={fieldState.invalid}
                  placeholder="مثال: SUMMER2024"
                  dir="ltr"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="type"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="coupon-type">نوع کوپن</FieldLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger
                    id="coupon-type"
                    aria-invalid={fieldState.invalid}
                  >
                    <SelectValue placeholder="انتخاب نوع کوپن" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={CouponType.CART}>سبد خرید</SelectItem>
                    <SelectItem value={CouponType.PRODUCT}>محصول</SelectItem>
                  </SelectContent>
                </Select>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>

        {/* ردیف دوم: روش تخفیف و مقدار */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Controller
            name="method"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="discount-method">نحوه اعمال تخفیف</FieldLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger
                    id="discount-method"
                    aria-invalid={fieldState.invalid}
                  >
                    <SelectValue placeholder="انتخاب روش تخفیف" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={DiscountMethod.PERCENT}>درصدی</SelectItem>
                    <SelectItem value={DiscountMethod.AMOUNT}>مبلغی</SelectItem>
                  </SelectContent>
                </Select>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="value"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="discount-value">
                  مقدار تخفیف {discountMethod === DiscountMethod.PERCENT ? '(درصد)' : '(تومان)'}
                </FieldLabel>
                <Input
                  {...field}
                  type="number"
                  id="discount-value"
                  aria-invalid={fieldState.invalid}
                  placeholder={discountMethod === DiscountMethod.PERCENT ? 'مثال: 20' : 'مثال: 50000'}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>

        {/* بخش مشروط بر اساس نوع کوپن */}
        {couponType === 'PRODUCT' && (
          <Controller
            name="productIds"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="product-select">انتخاب محصولات</FieldLabel>
                <AsyncCombobox
                  apiUrl="/api/products"
                  apiField="products"
                  queryField="name"
                  placeholder="جستجو و انتخاب محصولات"
                  multiple
                  selectedValues={selectedProducts}
                  onValuesChange={(values) => setSelectedProducts(values)}
                  disabled={isSubmitting}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}

                {/* نمایش محصولات انتخاب شده */}
                {selectedProducts.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <p className="text-sm text-muted-foreground">محصولات انتخاب شده:</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedProducts.map((productId) => (
                        <Badge
                          key={productId}
                          variant="secondary"
                          className="px-3 py-1"
                        >
                          {productId}
                          <button
                            type="button"
                            onClick={() => removeProduct(productId)}
                            className="mr-2 hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </Field>
            )}
          />
        )}

        {couponType === CouponType.CART && (
          <Controller
            name="minOrderAmount"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="min-order">حداقل مبلغ سفارش (تومان)</FieldLabel>
                <NumberInput
                  value={field.value}
                  onChange={field.onChange}
                  id="min-order"
                  aria-invalid={fieldState.invalid}
                  placeholder="مثال: 100000"
                  min={0}
                />
                <FieldDescription>اگر مبلغی وارد نکنید ، روی هر مبلغی از سبد خرید میتواند اعمال شود.</FieldDescription>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        )}

        {/* ردیف سوم: تعداد استفاده و تاریخ‌ها */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Controller
            name="maxUses"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="max-uses">تعداد استفاده</FieldLabel>
                <NumberInput
                  value={field.value}
                  onChange={field.onChange}
                  id="max-uses"
                  aria-invalid={fieldState.invalid}
                  placeholder="مثال: 100"
                  min={1}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="startDate"
            control={control}
            render={({ field, fieldState }) => {
              // تاریخ نمایشی (اگر null باشه، تاریخ امروز رو نشون بده)
              const displayDate = field.value || new Date()

              return (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="start-date">تاریخ شروع</FieldLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn('w-full justify-start text-right font-normal', !field.value && 'text-muted-foreground')}
                      >
                        <CalendarIcon className="ml-2 h-4 w-4" />
                        {formatPersianDate(displayDate)}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto p-0"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        selected={field.value || new Date()}
                        onSelect={(date) => field.onChange(date)}
                      />
                    </PopoverContent>
                  </Popover>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )
            }}
          />

          <Controller
            name="endDate"
            control={control}
            render={({ field, fieldState }) => {
              // تاریخ نمایشی (اگر null باشه، تاریخ امروز رو نشون بده)
              const displayDate = field.value || new Date()

              return (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="end-date">تاریخ پایان</FieldLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn('w-full justify-start text-right font-normal', !field.value && 'text-muted-foreground')}
                      >
                        <CalendarIcon className="ml-2 h-4 w-4" />
                        {formatPersianDate(displayDate)}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto p-0"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        selected={field.value || new Date()}
                        onSelect={(date) => field.onChange(date)}
                      />
                    </PopoverContent>
                  </Popover>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )
            }}
          />
        </div>

        {/* نمایش خلاصه کوپن */}
        <div className="p-4 bg-muted/50 rounded-lg border">
          <h3 className="font-medium mb-2">خلاصه کوپن:</h3>
          <div className="space-y-1 text-sm">
            <p>
              <span className="text-muted-foreground">کد:</span> <span className="font-mono">{watch('code') || '--'}</span>
            </p>
            <p>
              <span className="text-muted-foreground">نوع:</span> {watch('type') === 'CART' ? 'سبد خرید' : 'محصول'}
            </p>
            <p>
              <span className="text-muted-foreground">تخفیف:</span> {watch('value')} {watch('method') === 'PERCENT' ? '%' : 'تومان'}
            </p>
            {watch('type') === 'CART' && watch('minOrderAmount') && (
              <p>
                <span className="text-muted-foreground">حداقل سفارش:</span> {watch('minOrderAmount')?.toLocaleString()} تومان
              </p>
            )}
            {watch('type') === 'PRODUCT' && (
              <p>
                <span className="text-muted-foreground">تعداد محصولات:</span> {selectedProducts.length} محصول
              </p>
            )}
            <p>
              <span className="text-muted-foreground">اعتبار:</span> {formatPersianDate(watch('startDate'))} تا{' '}
              {formatPersianDate(watch('endDate'))}
            </p>
          </div>
        </div>
      </FieldGroup>

      <Button
        type="submit"
        loading={isSubmitting}
        className="w-full"
        size="lg"
      >
        {isEdit ? 'ویرایش کوپن' : 'ایجاد کوپن'}
      </Button>
    </form>
  )
}
