'use client'

import { Control, useFieldArray } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { ProductFormValues } from '@/validators/product.validator'
import { BadgeAlert } from 'lucide-react'
import { Alert, AlertTitle } from '@/components/ui/alert'
import AttributeInput from './AttributeInput'

interface Props {
  control: Control<ProductFormValues>
}

export default function AttributesForm({ control }: Props) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'attributes',
  })

  return (
    <div className="space-y-4">
      <div className={'absolute top-4 left-4'}>
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            append({
              key: '',
              label: '',
              value: '',
            })
          }
        >
          افزودن ویژگی
        </Button>
      </div>

      {!fields.length ? (
        <Alert>
          <BadgeAlert />
          <AlertTitle>هیچ ویژگی اضافه نشده است</AlertTitle>
        </Alert>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {fields.map((field, index) => (
            <AttributeInput
              key={field.id}
              index={index}
              control={control}
              onRemove={() => remove(index)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
