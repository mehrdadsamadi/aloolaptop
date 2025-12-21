import { Control, Controller, useWatch } from 'react-hook-form'
import { CategoryFormValues } from '@/validators/category.validator'
import { Field, FieldContent, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ATTRIBUTE_TYPE_CONSTANTS } from '@/lib/constants/category.constant'
import { AttributeType } from '@/types/admin/category.type'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import React from 'react'

interface AttributeItemProps {
  index: number
  control: Control<CategoryFormValues>
  onRemove: () => void
}

export default function AttributeItem({ index, control, onRemove }: AttributeItemProps) {
  const type = useWatch({
    control,
    name: `attributes.${index}.type`,
  })

  return (
    <div className="border p-4 rounded-lg flex flex-col gap-4">
      {/* key / label / type */}
      <div className="grid grid-cols-3 gap-2">
        <Controller
          name={`attributes.${index}.key`}
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>کلید</FieldLabel>
              <Input {...field} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name={`attributes.${index}.label`}
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>عنوان</FieldLabel>
              <Input {...field} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name={`attributes.${index}.type`}
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>نوع</FieldLabel>
              <Select
                value={field.value}
                onValueChange={field.onChange}
                dir={'rtl'}
              >
                <SelectTrigger>
                  <SelectValue placeholder="نوع" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>نوع</SelectLabel>
                    {Object.entries(ATTRIBUTE_TYPE_CONSTANTS).map(([key, label]) => (
                      <SelectItem
                        key={key}
                        value={key}
                      >
                        {label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>

      {/* dynamic fields */}
      {type && (
        <div className="bg-gray-100 rounded-md p-2">
          {type === AttributeType.STRING && (
            <Controller
              name={`attributes.${index}.options`}
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <Input
                    {...field}
                    placeholder="بنویسید"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          )}

          {type === AttributeType.NUMBER && (
            <Controller
              name={`attributes.${index}.options`}
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <Input
                    {...field}
                    placeholder="مقدار"
                    type={'number'}
                    value={field.value ?? ''}
                    onChange={(e) => {
                      const value = e.target.value
                      // اگر رشته خالی بود مقدار null بذار یا 0
                      field.onChange(value === '' ? null : parseInt(value, 10))
                    }}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          )}

          {type === AttributeType.BOOLEAN && (
            <div className={'border rounded-lg p-2'}>
              <Controller
                name={`attributes.${index}.options`}
                control={control}
                render={({ field }) => (
                  <Field orientation="horizontal">
                    <FieldContent>
                      <FieldLabel>بلی / خیر</FieldLabel>
                    </FieldContent>
                    <Switch
                      dir={'ltr'}
                      className={'cursor-pointer'}
                      onCheckedChange={field.onChange}
                    />
                  </Field>
                )}
              />
            </div>
          )}

          {type === AttributeType.SELECT && (
            <Controller
              name={`attributes.${index}.options`}
              control={control}
              render={({ field }) => {
                const [textValue, setTextValue] = React.useState((field.value || []).join(', '))

                return (
                  <Input
                    placeholder="مثال: قرمز,آبی،سبز"
                    value={textValue}
                    onChange={(e) => {
                      const value = e.target.value
                      setTextValue(value)

                      field.onChange(
                        value
                          .split(/[,،]/)
                          .map((v) => v.trim())
                          .filter(Boolean)
                      )
                    }}
                  />
                )
              }}
            />
          )}

          {type === AttributeType.RANGE && (
            <div className="grid grid-cols-2 gap-2">
              <Controller
                name={`attributes.${index}.options.0`}
                control={control}
                render={({ field }) => (
                  <Input
                    type="number"
                    placeholder="حداقل"
                    {...field}
                    value={field.value ?? ''}
                    onChange={(e) => {
                      const value = e.target.value
                      // اگر رشته خالی بود مقدار null بذار یا 0
                      field.onChange(value === '' ? null : parseInt(value, 10))
                    }}
                  />
                )}
              />
              <Controller
                name={`attributes.${index}.options.1`}
                control={control}
                render={({ field }) => (
                  <Input
                    type="number"
                    placeholder="حداکثر"
                    {...field}
                    value={field.value ?? ''}
                    onChange={(e) => {
                      const value = e.target.value
                      // اگر رشته خالی بود مقدار null بذار یا 0
                      field.onChange(value === '' ? null : parseInt(value, 10))
                    }}
                  />
                )}
              />
            </div>
          )}
        </div>
      )}

      {/* switches */}
      <div className="grid grid-cols-2 gap-2">
        <div className={'border rounded-lg p-2'}>
          <Controller
            name={`attributes.${index}.required`}
            control={control}
            render={({ field }) => (
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldLabel>اجباری</FieldLabel>
                </FieldContent>
                <Switch
                  dir={'ltr'}
                  className={'cursor-pointer'}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </Field>
            )}
          />
        </div>

        <div className={'border rounded-lg p-2'}>
          <Controller
            name={`attributes.${index}.showInFilter`}
            control={control}
            render={({ field }) => (
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldLabel>فیلتر شود</FieldLabel>
                </FieldContent>
                <Switch
                  dir={'ltr'}
                  className={'cursor-pointer'}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </Field>
            )}
          />
        </div>
      </div>

      <Button
        type="button"
        variant="destructive"
        className="w-fit"
        onClick={onRemove}
      >
        حذف
      </Button>
    </div>
  )
}
