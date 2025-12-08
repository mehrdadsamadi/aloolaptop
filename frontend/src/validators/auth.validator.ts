import * as z from 'zod'

export const mobileValidator = z.object({
  mobile: z.string().refine((value) => /^09\d{9}$/.test(value), {
    message: 'شماره موبایل معتبر نیست',
  }),
})

export type MobileSchemaType = z.infer<typeof mobileValidator>

export const otpValidator = z.object({
  code: z.string().refine((value) => /^\d{5}$/.test(value), {
    message: 'کد باید ۵ رقم باشد',
  }),
})

export type OtpSchemaType = z.infer<typeof otpValidator>
