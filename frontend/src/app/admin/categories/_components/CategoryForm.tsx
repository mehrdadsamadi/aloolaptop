'use client'

import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { InputGroup, InputGroupTextarea } from '@/components/ui/input-group'
import AttributesBuilder from './AttributesBuilder'
import { CategoryFormValues, categorySchema } from '@/validators/category.validator'
import { AsyncCombobox } from '@/components/input/asyncCombobox'
import { ImageUpload } from '@/components/input/imageUpload'
import { useState } from 'react'

interface Props {
  initialValues?: CategoryFormValues
  onSubmit: (values: CategoryFormValues, imageFile?: File | null) => Promise<void>
  isEdit?: boolean
}

export default function CategoryForm({ initialValues, onSubmit, isEdit }: Props) {
  const [imageFile, setImageFile] = useState<File | null>(null)

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: initialValues ?? {
      name: '',
      slug: '',
      description: '',
      parentId: null,
      order: 1,
      isActive: true,
      image: '',
      attributes: [],
    },
  })

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = form

  const handleSelectionChange = (value: string) => {
    form.setValue('parentId', value)
  }

  // تابع جدید برای ارسال فرم
  const handleFormSubmit = async (values: CategoryFormValues) => {
    // ارسال هم داده‌های فرم و هم فایل تصویر
    await onSubmit(values, imageFile)
  }

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className={'flex flex-col gap-4 h-full justify-between'}
    >
      <FieldGroup>
        <div className={'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2'}>
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-rhf-demo-name">نام دسته بندی</FieldLabel>
                <Input
                  {...field}
                  id="form-rhf-demo-name"
                  aria-invalid={fieldState.invalid}
                  placeholder="نام دسته بندی"
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
                <FieldLabel htmlFor="form-rhf-demo-slug">اسلاگ</FieldLabel>
                <Input
                  {...field}
                  id="form-rhf-demo-slug"
                  aria-invalid={fieldState.invalid}
                  placeholder="اسلاگ"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="order"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-rhf-demo-order">ترتیب</FieldLabel>
                <Input
                  {...field}
                  value={field.value ?? ''}
                  onChange={(e) => {
                    const value = e.target.value
                    // اگر رشته خالی بود مقدار null بذار یا 0
                    field.onChange(value === '' ? null : parseInt(value, 10))
                  }}
                  type={'number'}
                  id="form-rhf-demo-order"
                  aria-invalid={fieldState.invalid}
                  placeholder="ترتیب"
                  min={1}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>

        <Controller
          name="description"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-rhf-demo-description">توضیحات</FieldLabel>
              <InputGroup>
                <InputGroupTextarea
                  {...field}
                  id="form-rhf-demo-description"
                  placeholder="توضیحات"
                  rows={6}
                  className="min-h-24 resize-none"
                  aria-invalid={fieldState.invalid}
                />
              </InputGroup>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <div className={'grid grid-cols-2 gap-2'}>
          <Controller
            name="image"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>تصویر دسته‌بندی</FieldLabel>
                <ImageUpload
                  value={imageFile || field.value} // ارسال فایل یا URL قبلی
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

          <div className={'flex flex-col gap-4'}>
            <AsyncCombobox
              apiUrl="/api/categories" // آدرس API شما
              label={'دسته بندی والد'}
              placeholder="دسته بندی والد"
              onValueChange={handleSelectionChange}
            />

            <div className={' border rounded-lg p-2'}>
              <Controller
                name="isActive"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    orientation="horizontal"
                    data-invalid={fieldState.invalid}
                  >
                    <FieldContent>
                      <FieldLabel htmlFor="form-rhf-switch-isActive">فعال باشد</FieldLabel>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </FieldContent>
                    <Switch
                      dir={'ltr'}
                      id="form-rhf-switch-isActive"
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
          </div>
        </div>

        <AttributesBuilder control={control} />
      </FieldGroup>

      <Button
        type="submit"
        loading={isSubmitting}
        className={'w-full'}
      >
        {isEdit ? 'ویرایش دسته‌بندی' : 'ایجاد دسته‌بندی'}
      </Button>
    </form>
  )
}
