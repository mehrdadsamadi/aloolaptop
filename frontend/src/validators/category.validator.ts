import { z } from 'zod'
import { AttributeType } from '@/types/admin/category.type'

export const categorySchema = z.object({
  name: z.string().min(1, 'نام دسته‌بندی الزامی است'),
  slug: z.string().min(1, 'اسلاگ الزامی است'),
  description: z.string().optional(),
  parentId: z.string().nullable().optional(),
  order: z.number().min(1),
  isActive: z.boolean(),
  image: z.any().optional(),

  attributes: z.array(
    z.object({
      key: z.string().min(1),
      label: z.string().min(1),
      type: z.enum(AttributeType),
      options: z.any().optional(),
      required: z.boolean(),
      showInFilter: z.boolean(),
    })
  ),
})

export type CategoryFormValues = z.infer<typeof categorySchema>
