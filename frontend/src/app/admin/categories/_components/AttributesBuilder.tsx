import { Control, useFieldArray } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { AttributeType } from '@/types/admin/category.type'
import { CategoryFormValues } from '@/validators/category.validator'
import { BadgeAlert } from 'lucide-react'
import { Alert, AlertTitle } from '@/components/ui/alert'
import AttributeItem from '@/app/admin/categories/_components/AttributeItem'

interface Props {
  control: Control<CategoryFormValues>
}

export default function AttributesBuilder({ control }: Props) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'attributes',
  })

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">ویژگی‌ها</h3>
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            append({
              key: '',
              label: '',
              type: AttributeType.STRING,
              required: false,
              showInFilter: false,
              options: [],
            })
          }
        >
          افزودن ویژگی
        </Button>
      </div>

      {!fields.length ? (
        <Alert>
          <BadgeAlert />
          <AlertTitle>ویژگی اضافه نشده است</AlertTitle>
        </Alert>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
          {fields.map((field, index) => (
            <AttributeItem
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
