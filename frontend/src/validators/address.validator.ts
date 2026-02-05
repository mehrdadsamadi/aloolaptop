// validators/address.validator.ts
import { z } from 'zod'

export const addressSchema = z
  .object({
    title: z.string().min(1, { message: 'عنوان آدرس الزامی است' }),
    state: z.string().min(1, { message: 'نام استان الزامی است' }),
    city: z.string().min(1, { message: 'نام شهر الزامی است' }),
    postalCode: z
      .string()
      .min(1, { message: 'کد پستی الزامی است' })
      .regex(/^\d{10}$/, { message: 'کد پستی باید ۱۰ رقم باشد' }),
    address: z.string().min(1, { message: 'آدرس کامل الزامی است' }),
    latitude: z.string().optional().nullable(),
    longitude: z.string().optional().nullable(),
    isDefault: z.boolean().default(false),
  })
  .superRefine((data, ctx) => {
    // اگر یکی از مختصات وارد شده، دیگری هم باید وارد شود
    if ((data.latitude && !data.longitude) || (!data.latitude && data.longitude)) {
      ctx.addIssue({
        code: 'custom',
        path: ['latitude'],
        message: 'اگر مختصات وارد می‌کنید، هر دو باید وارد شوند',
      })
      ctx.addIssue({
        code: 'custom',
        path: ['longitude'],
        message: 'اگر مختصات وارد می‌کنید، هر دو باید وارد شوند',
      })
    }

    // اعتبارسنجی محدوده مختصات جغرافیایی ایران
    if (data.latitude && data.longitude) {
      const lat = parseFloat(data.latitude)
      const lng = parseFloat(data.longitude)

      if (isNaN(lat) || isNaN(lng)) {
        ctx.addIssue({
          code: 'custom',
          path: ['latitude'],
          message: 'مختصات باید عدد معتبر باشد',
        })
      } else {
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
      }
    }
  })

// برای ارسال به API
export const addressApiSchema = addressSchema.transform((data) => ({
  title: data.title,
  state: data.state,
  city: data.city,
  postalCode: data.postalCode,
  address: data.address,
  latitude: data.latitude ? parseFloat(data.latitude) : undefined,
  longitude: data.longitude ? parseFloat(data.longitude) : undefined,
  isDefault: data.isDefault,
}))

export type AddressFormInput = z.input<typeof addressSchema>
export type AddressFormValues = z.output<typeof addressApiSchema>
