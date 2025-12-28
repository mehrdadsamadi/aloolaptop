'use client'

import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { showError } from '@/lib/utils'
import { CouponFormValues } from '@/validators/coupon.validator'
import { createCoupon } from '@/actions/coupon.action'
import CouponForm from '@/app/admin/coupons/_components/CouponForm'

export default function CreateCouponPage() {
  const router = useRouter()

  const handleCreateCoupon = async (data: CouponFormValues) => {
    try {
      // 3. فراخوانی action
      const res = await createCoupon(data)

      if (res?.ok === false) {
        showError(res.messages)
        return
      }

      toast.success(res?.message || 'کوپن با موفقیت ایجاد شد')
      router.push('/admin/coupons')
    } catch (error) {
      console.error('Error creating category:', error)
      toast.error('خطا در ایجاد کوپن')
    }
  }

  return <CouponForm onSubmit={handleCreateCoupon} />
}
