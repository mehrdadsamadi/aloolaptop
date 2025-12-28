import { z } from 'zod'
import { CouponType, DiscountMethod } from '@/types/admin/coupon.type'

export const couponSchema = z
  .object({
    code: z.string().min(1, { message: 'کد تخفیف الزامی است' }),

    type: z.enum(Object.values(CouponType) as [string, ...string[]], {
      error: () => 'نوع کوپن الزامی است',
    }),

    method: z.enum(Object.values(DiscountMethod) as [string, ...string[]], {
      error: () => 'نحوه اعمال تخفیف الزامی است',
    }),

    value: z
      .number({
        error: () => 'مقدار تخفیف باید عدد باشد',
      })
      .min(0, 'مقدار تخفیف نمی‌تواند منفی باشد'),

    productIds: z.array(z.string()).optional().default([]),

    minOrderAmount: z
      .number({
        error: () => 'حداقل مبلغ سفارش باید عدد باشد',
      })
      .min(0, 'حداقل مبلغ سفارش نمی‌تواند منفی باشد')
      .optional()
      .nullable(),

    maxUses: z
      .number({
        error: () => 'تعداد استفاده باید عدد باشد',
      })
      .min(1, 'تعداد استفاده باید حداقل ۱ باشد'),

    startDate: z.union([z.string(), z.date()]).transform((val) => {
      return typeof val === 'string' ? new Date(val) : val
    }),

    endDate: z.union([z.string(), z.date()]).transform((val) => {
      return typeof val === 'string' ? new Date(val) : val
    }),
  })
  .superRefine((data, ctx) => {
    // اگر تخفیف درصدی باشد، مقدار نباید بیش از 100 باشد
    if (data.method === DiscountMethod.PERCENT && data.value > 100) {
      ctx.addIssue({
        code: 'custom',
        path: ['value'],
        message: 'درصد تخفیف نمی‌تواند بیش از ۱۰۰ باشد',
      })
    }

    // اگر نوع کوپن PRODUCT باشد، حداقل یک محصول باید باشد
    if (data.type === CouponType.PRODUCT && data.productIds?.length === 0) {
      ctx.addIssue({
        code: 'custom',
        path: ['productIds'],
        message: 'برای کوپن محصولی، حداقل یک محصول باید انتخاب شود',
      })
    }

    // اگر نوع CART باشد، minOrderAmount باید معتبر باشد
    // if (data.type === CouponType.CART && (!data.minOrderAmount || data.minOrderAmount <= 0)) {
    //   ctx.addIssue({
    //     code: 'custom',
    //     path: ['minOrderAmount'],
    //     message: 'برای کوپن سبد خرید، حداقل مبلغ سفارش الزامی است',
    //   })
    // }

    // تاریخ پایان باید بعد از شروع باشد
    const startDate = new Date(data?.startDate)
    const endDate = new Date(data?.endDate)

    if (endDate <= startDate) {
      ctx.addIssue({
        code: 'custom',
        path: ['endDate'],
        message: 'تاریخ پایان باید بعد از تاریخ شروع باشد',
      })
    }

    // شروع نباید قبل از امروز باشد
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (startDate < today) {
      ctx.addIssue({
        code: 'custom',
        path: ['startDate'],
        message: 'تاریخ شروع نمی‌تواند قبل از امروز باشد',
      })
    }
  })

export type CouponFormValues = z.infer<typeof couponSchema>
