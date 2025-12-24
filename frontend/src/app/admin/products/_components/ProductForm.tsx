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
import { ProductFormValues, productSchema } from '@/validators/product.validator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CalendarHijri as Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { faIR } from 'date-fns/locale'
import AttributesForm from './AttributesForm'
import { ProductCondition, ProductGrade } from '@/types/admin/product.type'
import ImagesUploader from '@/components/input/ImagesUploader'
import { CONDITION_CONSTANTS } from '@/lib/constants/product.constant'

interface Props {
  initialValues?: ProductFormValues
  onSubmit: (values: ProductFormValues, imageFiles?: File[]) => Promise<void>
  isEdit?: boolean
}

export default function ProductForm({ initialValues, onSubmit, isEdit }: Props) {
  const [images, setImages] = useState<any[]>([])
  const [newImageFiles, setNewImageFiles] = useState<File[]>([])

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: initialValues ?? {
      name: '',
      slug: '',
      description: '',
      categoryId: '',
      condition: ProductCondition.NEW,
      grade: ProductGrade.A_DOUBLE_PLUS,
      price: 0,
      stock: null,
      attributes: [],
      images: [],
      isActive: true,
      discountPercent: 0,
      discountExpiresAt: null,
    },
  })

  // تبدیل images از سرور به فرمت ImagesUploader
  useEffect(() => {
    if (initialValues?.images) {
      const serverImages = initialValues.images.map((img) => ({
        url: img.url,
        key: img.key,
        alt: img.alt,
      }))
      setImages(serverImages)
    }
  }, [initialValues])

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = form

  // تابع برای ارسال فرم
  const handleFormSubmit = async (values: ProductFormValues) => {
    // ارسال هم داده‌های فرم و هم فایل‌های تصویر جدید
    await onSubmit(values, newImageFiles.length > 0 ? newImageFiles : undefined)
  }

  // تابع مدیریت تغییر تصاویر
  const handleImagesChange = (updatedImages: any[]) => {
    setImages(updatedImages)

    // استخراج فایل‌های جدید
    const files = updatedImages.filter((img) => img.file).map((img) => img.file)

    setNewImageFiles(files)

    // آپدیت فیلد images در فرم
    const formImages = updatedImages.map((img) => ({
      url: img.url,
      key: img.key || img.file?.name,
      alt: img.alt || img.file?.name,
    }))

    form.setValue('images', formImages)
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
                  <Input
                    {...field}
                    value={field.value ?? ''}
                    onChange={(e) => {
                      const value = e.target.value
                      field.onChange(value === '' ? null : parseInt(value, 10))
                    }}
                    type="number"
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
                  <Input
                    {...field}
                    value={field.value ?? ''}
                    onChange={(e) => {
                      const value = e.target.value
                      field.onChange(value === '' ? null : parseInt(value, 10))
                    }}
                    type="number"
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

            <Controller
              name="discountExpiresAt"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="product-discount-expiry">انقضای تخفیف</FieldLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn('w-full justify-start text-right font-normal', !field.value && 'text-muted-foreground')}
                      >
                        <CalendarIcon className="ml-2 h-4 w-4" />
                        {field.value ? format(field.value, 'PPP', { locale: faIR }) : <span>انتخاب تاریخ</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto p-0"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        selected={field.value || undefined}
                        onSelect={field.onChange}
                        initialFocus
                        locale={faIR}
                      />
                    </PopoverContent>
                  </Popover>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
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
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold mb-4">تصاویر محصول</h3>
          <ImagesUploader
            value={images}
            onChange={handleImagesChange}
            maxFiles={10}
            maxSize={5}
            accept="image/*"
            disabled={isSubmitting}
          />
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
