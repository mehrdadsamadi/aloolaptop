'use client'

import { Control, Controller } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { ProductFormValues } from '@/validators/product.validator'

interface Props {
  control: Control<ProductFormValues>
  index: number
  onRemove: () => void
}

export default function AttributeInput({ control, index, onRemove }: Props) {
  return (
    <div className="border rounded-lg p-4 bg-white">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-medium">ویژگی #{index + 1}</h4>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="text-red-500 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Controller
          name={`attributes.${index}.key`}
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={`attribute-key-${index}`}>کلید</FieldLabel>
              <Input
                {...field}
                id={`attribute-key-${index}`}
                placeholder="مثلا: ram"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name={`attributes.${index}.label`}
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={`attribute-label-${index}`}>عنوان فارسی</FieldLabel>
              <Input
                {...field}
                id={`attribute-label-${index}`}
                placeholder="مثلا: رم"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name={`attributes.${index}.value`}
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={`attribute-value-${index}`}>مقدار</FieldLabel>
              <Input
                {...field}
                id={`attribute-value-${index}`}
                placeholder="مثلا: 8GB"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>
    </div>
  )
}
