import { z } from 'zod'

export const mobileValidator = z.object({
  mobile: z.string().regex(/^09\d{9}$/, 'شماره موبایل معتبر نیست'),
})

export type MobileSchemaType = z.infer<typeof mobileValidator>

export const otpValidator = z.object({
  code: z.string().regex(/^\d{5}$/, 'کد باید ۵ رقم باشد'),
})

export type OtpSchemaType = z.infer<typeof otpValidator>
