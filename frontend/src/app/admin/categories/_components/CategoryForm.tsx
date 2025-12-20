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

interface Props {
  initialValues?: CategoryFormValues
  onSubmit: (values: CategoryFormValues) => Promise<void>
  isEdit?: boolean
}

export default function CategoryForm({ initialValues, onSubmit, isEdit }: Props) {
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: initialValues ?? {
      name: '',
      slug: '',
      description: '',
      parentId: null,
      order: 0,
      isActive: true,
      attributes: [],
    },
  })

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = form

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={'flex flex-col gap-4 h-full justify-between'}
    >
      <FieldGroup>
        <div className={'grid grid-cols-3 gap-2'}>
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
                  type={'number'}
                  id="form-rhf-demo-order"
                  aria-invalid={fieldState.invalid}
                  placeholder="ترتیب"
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

        <div className={'max-w-[8rem]'}>
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
