import { Control, Controller, useFieldArray } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AttributeType } from '@/types/admin/category.type'
import { CategoryFormValues } from '@/validators/category.validator'
import { Field, FieldContent, FieldError, FieldLabel } from '@/components/ui/field'
import { ATTRIBUTE_TYPE_CONSTANTS } from '@/lib/constants/category.constant'
import { BadgeAlert } from 'lucide-react'
import { Alert, AlertTitle } from '@/components/ui/alert'
import { Switch } from '@/components/ui/switch'

interface Props {
  control: Control<CategoryFormValues>
}

export default function AttributesBuilder({ control }: Props) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'attributes',
  })

  // const attributeType = useWatch({
  //   control,
  //   name: `attributes.${index}.type`,
  // })

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

      {!fields?.length ? (
        <Alert>
          <BadgeAlert />
          <AlertTitle>ویژگی اضافه نشده است</AlertTitle>
        </Alert>
      ) : (
        <div className={'grid grid-cols-2 gap-2'}>
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="border p-4 rounded-lg flex flex-col gap-4"
            >
              <div className={'grid grid-cols-3 gap-2'}>
                <Controller
                  name={`attributes.${index}.key`}
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-rhf-demo-attr-key">کلید</FieldLabel>
                      <Input
                        {...field}
                        id="form-rhf-demo-attr-key"
                        aria-invalid={fieldState.invalid}
                        placeholder="کلید"
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
                      <FieldLabel htmlFor="form-rhf-demo-attr-label">عنوان</FieldLabel>
                      <Input
                        {...field}
                        id="form-rhf-demo-attr-label"
                        aria-invalid={fieldState.invalid}
                        placeholder="عنوان"
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                <Controller
                  name={`attributes.${index}.type`}
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-rhf-demo-attr-type">نوع مشخصات</FieldLabel>
                      <Select
                        dir={'rtl'}
                        name={field.name}
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          id="form-rhf-demo-attr-type"
                          aria-invalid={fieldState.invalid}
                          className="w-full"
                        >
                          <SelectValue placeholder="نوع" />
                        </SelectTrigger>
                        <SelectContent position="item-aligned">
                          <SelectGroup>
                            <SelectLabel>نوع</SelectLabel>
                            {Object.entries(ATTRIBUTE_TYPE_CONSTANTS).map(([key, value]) => (
                              <SelectItem
                                key={key}
                                value={key}
                                className={'cursor-pointer'}
                              >
                                {value}
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

              {/*{JSON.stringify(field, null, 2)}*/}
              {JSON.stringify(field?.type, null, 2)}
              {field?.type && (
                <div
                  className={'bg-gray-100 rounded-md p-2'}
                  key={field.type}
                >
                  {field?.type === AttributeType.STRING && <div>STRING</div>}
                  {field?.type === AttributeType.NUMBER && <div>NUMBER</div>}
                  {field?.type === AttributeType.BOOLEAN && <div>BOOLEAN</div>}
                  {field?.type === AttributeType.SELECT && <div>SELECT</div>}
                  {field?.type === AttributeType.RANGE && <div>RANGE</div>}
                </div>
              )}

              <div className={'grid grid-cols-2 gap-2'}>
                <div className={' bg-gray-100 rounded-md p-2'}>
                  <Controller
                    name={`attributes.${index}.required`}
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field
                        orientation="horizontal"
                        data-invalid={fieldState.invalid}
                      >
                        <FieldContent>
                          <FieldLabel htmlFor="form-rhf-switch-attr-required">اجباری باشد</FieldLabel>
                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </FieldContent>
                        <Switch
                          dir={'ltr'}
                          id="form-rhf-switch-attr-required"
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

                <div className={'bg-gray-100 rounded-md p-2'}>
                  <Controller
                    name={`attributes.${index}.showInFilter`}
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field
                        orientation="horizontal"
                        data-invalid={fieldState.invalid}
                      >
                        <FieldContent>
                          <FieldLabel htmlFor="form-rhf-switch-attr-showInFilter">فیلتر شود</FieldLabel>
                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </FieldContent>
                        <Switch
                          dir={'ltr'}
                          id="form-rhf-switch-attr-showInFilter"
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

              <Button
                className={'w-fit'}
                type="button"
                variant="destructive"
                onClick={() => remove(index)}
              >
                حذف
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
