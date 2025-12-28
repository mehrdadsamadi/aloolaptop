import { z } from 'zod'
import { AttributeType } from '@/types/admin/category.type'

export const categorySchema = z.object({
  name: z.string().min(1, 'نام دسته‌بندی الزامی است'),

  slug: z
    .string()
    .min(1, 'اسلاگ الزامی است')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'اسلاگ باید شامل حروف کوچک، اعداد و خط تیره باشد'),

  description: z.string().optional(),

  parentId: z.string().nullable().optional(),

  order: z.number().min(1, 'ترتیب باید حداقل ۱ باشد'),

  isActive: z.boolean(),

  image: z.any().optional(),

  attributes: z.array(
    z.object({
      key: z.string().min(1, 'کلید ویژگی الزامی است'),

      label: z.string().min(1, 'عنوان ویژگی الزامی است'),

      type: z.enum(Object.values(AttributeType) as [string, ...string[]]),

      options: z.any().optional(),

      required: z.boolean(),

      showInFilter: z.boolean(),
    })
  ),
})

export type CategoryFormValues = z.infer<typeof categorySchema>
