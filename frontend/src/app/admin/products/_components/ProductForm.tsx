'use client'

import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { InputGroup, InputGroupTextarea } from '@/components/ui/input-group'
import { AsyncCombobox } from '@/components/input/asyncCombobox'
import { useEffect, useState } from 'react'
import { ProductFormInput, ProductFormValues, productSchema } from '@/validators/product.validator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon, Trash2Icon, TrashIcon, X } from 'lucide-react'
import { cn, formatPersianDate } from '@/lib/utils'
import { format } from 'date-fns'
import AttributesForm from './AttributesForm'
import { ProductCondition, ProductGrade } from '@/types/admin/product.type'
import { CONDITION_CONSTANTS } from '@/lib/constants/product.constant'
import { NumberInput } from '@/components/input/numberInput'
import { IImage } from '@/types/image.type'
import Image from 'next/image'
import { useConfirm } from '@/hooks/useConfirm'

interface Props {
  initialValues?: ProductFormInput
  onSubmit: (values: ProductFormValues) => Promise<void>
  isEdit?: boolean
}

export default function ProductForm({ initialValues, onSubmit, isEdit }: Props) {
  const { confirm } = useConfirm()

  const form = useForm<ProductFormInput>({
    resolver: zodResolver(productSchema),
    defaultValues: initialValues ?? {
      name: '',
      slug: '',
      description: '',
      categoryId: '',
      condition: ProductCondition.NEW,
      grade: undefined,
      price: 0,
      stock: null,
      attributes: [],
      images: [],
      isActive: true,
      discountPercent: 0,
      discountExpiresAt: null,
    },
  })

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = form

  useEffect(() => {
    if (form.watch('condition') === ProductCondition.NEW) {
      form.setValue('grade', undefined)
    }
  }, [form, form.watch('condition')])

  // تابع برای ارسال فرم
  const handleFormSubmit = async (values: ProductFormInput) => {
    const parsedValues = productSchema.parse(values)
    await onSubmit(parsedValues)
  }

  const removeImageByKey = (imageKey: string) => {
    let images = form.getValues('images')

    images = images?.filter((img) => img?.key !== imageKey)

    form.setValue('images', images)
  }

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className={'flex flex-col gap-6 h-full justify-between'}
    >
      <FieldGroup className="space-y-6">
        {/* بخش اطلاعات اصلی */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold mb-4">اطلاعات اصلی محصول</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="product-name">نام محصول</FieldLabel>
                  <Input
                    {...field}
                    id="product-name"
                    aria-invalid={fieldState.invalid}
                    placeholder="نام محصول"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="slug"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="product-slug">اسلاگ</FieldLabel>
                  <Input
                    {...field}
                    id="product-slug"
                    aria-invalid={fieldState.invalid}
                    placeholder="اسلاگ محصول"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="categoryId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="product-category">دسته‌بندی</FieldLabel>
                  <AsyncCombobox
                    apiUrl="/api/categories"
                    apiField={'categories'}
                    queryField={'name'}
                    placeholder="انتخاب دسته‌بندی"
                    initialValue={field.value}
                    onValueChange={field.onChange}
                    // error={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="price"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="product-price">قیمت (تومان)</FieldLabel>
                  <NumberInput
                    value={field.value}
                    onChange={field.onChange}
                    id="product-price"
                    aria-invalid={fieldState.invalid}
                    placeholder="قیمت محصول"
                    min={0}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="stock"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="product-stock">موجودی</FieldLabel>
                  <NumberInput
                    value={field.value}
                    onChange={field.onChange}
                    id="product-stock"
                    aria-invalid={fieldState.invalid}
                    placeholder="تعداد موجود"
                    min={0}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="condition"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="product-condition">وضعیت محصول</FieldLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="انتخاب وضعیت" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(CONDITION_CONSTANTS).map(([key, value]) => (
                        <SelectItem
                          key={key}
                          value={key}
                        >
                          {value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="grade"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="product-grade">درجه کیفیت</FieldLabel>
                  <Select
                    disabled={form.watch('condition') === ProductCondition.NEW}
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="انتخاب درجه (اختیاری)" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(ProductGrade).map((grade) => (
                        <SelectItem
                          key={grade}
                          value={grade}
                        >
                          {grade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="discountPercent"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="product-discount">درصد تخفیف</FieldLabel>
                  <Input
                    {...field}
                    value={field.value ?? ''}
                    onChange={(e) => {
                      const value = e.target.value
                      field.onChange(value === '' ? null : parseInt(value, 10))
                    }}
                    type="number"
                    id="product-discount"
                    aria-invalid={fieldState.invalid}
                    placeholder="مثلا ۲۰"
                    min={0}
                    max={100}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            {/* TODO: موقع ویرایش وقتی تاریخ انقضا داشته باشد و تغییرش ندیم ، خطا میده */}
            <Controller
              name="discountExpiresAt"
              control={form.control}
              render={({ field, fieldState }) => {
                // تاریخ نمایشی (اگر null باشه، تاریخ امروز رو نشون بده)
                const displayDate = field.value || new Date()

                // تابع مدیریت انتخاب تاریخ
                const handleDateSelect = (date: Date | undefined) => {
                  // اگر تاریخ انتخاب شده با تاریخ امروز یکسان باشه، null بفرست
                  // اینطوری کاربر می‌تونه تاریخ رو حذف کنه
                  if (date && format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')) {
                    field.onChange(null)
                  } else {
                    field.onChange(date)
                  }
                }

                return (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="product-discount-expiry">انقضای تخفیف</FieldLabel>
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
                          onSelect={handleDateSelect}
                        />
                      </PopoverContent>
                    </Popover>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )
              }}
            />
          </div>
        </div>

        {/* بخش توضیحات */}
        <Controller
          name="description"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="product-description">توضیحات محصول</FieldLabel>
              <InputGroup>
                <InputGroupTextarea
                  {...field}
                  id="product-description"
                  placeholder="توضیحات کامل محصول"
                  rows={6}
                  className="min-h-24 resize-none"
                  aria-invalid={fieldState.invalid}
                />
              </InputGroup>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* بخش تصاویر */}
        <div className="bg-gray-50 rounded-lg p-4 flex flex-col gap-4">
          <div className="w-full flex items-center justify-between gap-2">
            <h3 className="font-semibold mb-4">تصاویر محصول</h3>

            {/* TODO: درست کرد مدال و دکمه انتخاب تصویر */}
            {form.getValues('images')?.length < 10 && <Button>انتخاب تصویر</Button>}
          </div>

          <div className="flex items-center gap-4">
            {form.getValues('images')?.map((img) => (
              <div
                key={img?.key}
                className="max-w-[250px] relative group cursor-pointer"
              >
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg p-2">
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={() => {
                      confirm({
                        title: 'حذف تصویر',
                        description: `آیا از حذف تصویر مطمئن هستید؟`,
                        confirmText: 'بله',
                        cancelText: 'لغو',
                        onConfirm: () => removeImageByKey(img?.key),
                      })
                    }}
                  >
                    <Trash2Icon className="w-3 h-3" />
                  </Button>
                </div>

                <Image
                  src={img?.url}
                  alt={img?.key}
                  width={200}
                  height={200}
                  className="rounded-md w-full"
                />
              </div>
            ))}
          </div>
        </div>

        {/* بخش ویژگی‌ها */}
        <div className="bg-gray-50 rounded-lg p-4 relative">
          <h3 className="font-semibold mb-4">ویژگی‌های محصول</h3>
          <AttributesForm control={control} />
        </div>

        {/* وضعیت فعال بودن */}
        <div className="border rounded-lg p-4">
          <Controller
            name="isActive"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                orientation="horizontal"
                data-invalid={fieldState.invalid}
              >
                <FieldContent>
                  <FieldLabel htmlFor="product-isActive">محصول فعال باشد</FieldLabel>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </FieldContent>
                <Switch
                  dir={'ltr'}
                  id="product-isActive"
                  className={'cursor-pointer'}
                  name={field.name}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  aria-invalid={fieldState.invalid}
                />
              </Field>
            )}
          />
        </div>
      </FieldGroup>

      <Button
        type="submit"
        loading={isSubmitting}
        className={'w-full mt-6'}
      >
        {isEdit ? 'ویرایش محصول' : 'ایجاد محصول'}
      </Button>
    </form>
  )
}
