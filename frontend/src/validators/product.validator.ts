import { z } from 'zod'
import { ProductCondition, ProductGrade } from '@/types/admin/product.type'

// ولیدیشن برای ویژگی‌های محصول
const attributeSchema = z.object({
  key: z.string().min(1, 'کلید ویژگی الزامی است'),
  label: z.string().optional(),
  value: z.string().min(1, 'مقدار ویژگی الزامی است'),
})

// ولیدیشن اصلی فرم محصول
export const productSchema = z.object({
  name: z.string().min(1, 'نام محصول الزامی است'),

  slug: z
    .string()
    .min(1, 'اسلاگ الزامی است')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'اسلاگ باید شامل حروف کوچک، اعداد و خط تیره باشد'),

  description: z.string().optional(),

  categoryId: z.string().min(1, 'دسته‌بندی الزامی است'),

  condition: z.enum(ProductCondition, { error: 'وضعیت محصول را انتخاب کنید' }),

  grade: z.enum(ProductGrade).optional().nullable().default(null),

  price: z.number({ error: 'قیمت الزامی است' }).min(0, 'قیمت نمی‌تواند منفی باشد').positive('قیمت باید بزرگتر از صفر باشد'),

  stock: z.number().min(0, 'موجودی نمی‌تواند منفی باشد').optional().nullable().default(null),

  attributes: z.array(attributeSchema).optional().default([]),

  images: z.any().optional().default([]),

  isActive: z.boolean().default(true),

  discountPercent: z.number().min(0, 'درصد تخفیف نمی‌تواند منفی باشد').max(100, 'درصد تخفیف نمی‌تواند بیشتر از ۱۰۰ باشد'),

  discountExpiresAt: z
    .union([
      z.string(), // قبول کردن string
      z.date(), // قبول کردن Date object
    ])
    .optional()
    .nullable()
    .default(null)
    .transform((val) => {
      if (!val) return null
      // تبدیل string به Date
      if (typeof val === 'string') {
        return new Date(val)
      }
      return val
    }),
})

export type ProductFormValues = z.infer<typeof productSchema>
