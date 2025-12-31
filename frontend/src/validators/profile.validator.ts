import { z } from 'zod'

export const profileSchema = z.object({
  firstName: z.string().optional(),

  lastName: z.string().optional(),

  avatar: z.any().optional(),
})

export type ProfileFormValues = z.infer<typeof profileSchema>
