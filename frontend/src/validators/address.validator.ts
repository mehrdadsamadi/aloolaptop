// validators/address.validator.ts
import { z } from 'zod'

// schema برای فرم - ورودی‌ها string هستند
export const addressFormSchema = z
  .object({
    title: z.string().min(1, { message: 'عنوان آدرس الزامی است' }),
    state: z.string().min(1, { message: 'نام استان الزامی است' }),
    city: z.string().min(1, { message: 'نام شهر الزامی است' }),
    postalCode: z
      .string()
      .min(1, { message: 'کد پستی الزامی است' })
      .regex(/^\d{10}$/, { message: 'کد پستی باید ۱۰ رقم باشد' }),
    address: z.string().min(1, { message: 'آدرس کامل الزامی است' }),
    latitude: z
      .string()
      .min(1, { message: 'عرض جغرافیایی الزامی است' })
      .refine((val) => !isNaN(parseFloat(val)), {
        message: 'عرض جغرافیایی باید عدد معتبر باشد',
      }),
    longitude: z
      .string()
      .min(1, { message: 'طول جغرافیایی الزامی است' })
      .refine((val) => !isNaN(parseFloat(val)), {
        message: 'طول جغرافیایی باید عدد معتبر باشد',
      }),
    isDefault: z.boolean().default(false),
  })
  .superRefine((data, ctx) => {
    const lat = parseFloat(data.latitude)
    const lng = parseFloat(data.longitude)

    // اعتبارسنجی محدوده مختصات جغرافیایی ایران
    if (lat < 25 || lat > 40) {
      ctx.addIssue({
        code: 'custom',
        path: ['latitude'],
        message: 'عرض جغرافیایی باید بین ۲۵ تا ۴۰ درجه باشد',
      })
    }
    if (lng < 44 || lng > 63) {
      ctx.addIssue({
        code: 'custom',
        path: ['longitude'],
        message: 'طول جغرافیایی باید بین ۴۴ تا ۶۳ درجه باشد',
      })
    }
  })

// schema برای API - خروجی‌ها number هستند
export const addressApiSchema = addressFormSchema.transform((data) => ({
  title: data.title,
  state: data.state,
  city: data.city,
  postalCode: data.postalCode,
  address: data.address,
  latitude: parseFloat(data.latitude),
  longitude: parseFloat(data.longitude),
  isDefault: data.isDefault,
}))

// انواع TypeScript
export type AddressFormInput = z.input<typeof addressFormSchema> // string ها
export type AddressFormValues = z.output<typeof addressApiSchema> // number ها
