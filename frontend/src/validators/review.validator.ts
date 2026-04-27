import { z } from 'zod'

export const reviewSchema = z.object({
  productId: z.string().min(1, 'آیدی محصول الزامی است'),

  rating: z.number().min(1, 'امتیاز باید بین 1 تا 5 باشد').max(5, 'امتیاز باید بین 1 تا 5 باشد'),

  comment: z.string().optional(),
})

export type ReviewFormValues = z.infer<typeof reviewSchema>
