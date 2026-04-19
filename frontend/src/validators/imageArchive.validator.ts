import { z } from 'zod'

export const imageArchive = z.object({
  title: z.string().min(1, 'عنوان تصویر الزامی است'),

  image: z.any().optional(),
})

export type ImageArchiveFormValues = z.infer<typeof imageArchive>
