'use client'

import { Dialog } from '@/components/common/dialog'
import { Button } from '@/components/ui/button'
import { useUser } from '@/hooks/useUser'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { showError } from '@/lib/utils'
import { ReviewFormValues, reviewSchema } from '@/validators/review.validator'
import { createReview } from '@/actions/review.action'
import { Rating } from '@/components/ui/rating'
import { Textarea } from '@/components/ui/textarea'

interface AddReviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onComplete: () => void
  productId: string
}

export default function AddReviewDialog({ open, onOpenChange, onComplete, productId }: AddReviewDialogProps) {
  const { user } = useUser()

  const [loading, setLoading] = useState(false)

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      productId: productId,
      rating: 1,
      comment: '',
    },
  })

  const { handleSubmit } = form

  useEffect(() => {
    if (open) {
      form.reset({
        productId,
        rating: 1,
        comment: '',
      })
    }
  }, [open])

  const handleFormSubmit = async (data: ReviewFormValues) => {
    try {
      setLoading(true)

      if (!user) {
        toast.error('لطفاً ابتدا وارد حساب کاربری خود شوید')
        return
      }
  
      if (data.rating === 0) {
        toast.error('لطفاً امتیاز خود را انتخاب کنید')
        return
      }

      const res = await createReview({ ...data, comment: data?.comment?.trim() || undefined })

      if (res?.ok === false) {
        showError(res.messages)
        return
      }

      form.reset({
        productId,
        rating: 1,
        comment: '',
      })

      toast.success(res?.message || 'نظر شما با موفقیت ثبت شد')

      onComplete()
      onOpenChange(false)
    } catch (error) {
      console.log('error', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog
      title={'ثبت نظر جدید'}
      description={'نظر و امتیاز خود را درباره این محصول با ما به اشتراک بگذارید'}
      open={open}
      onOpenChange={onOpenChange}
      size="md"
      showCloseButton={true}
      actions={
        <div className="flex items-center gap-4 w-full">
          <Button
            variant="default"
            onClick={handleSubmit(handleFormSubmit)}
            loading={loading}
          >
            ثبت نظر
          </Button>

          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            loading={loading}
          >
            انصراف
          </Button>
        </div>
      }
    >
      <form className={'flex flex-col h-full justify-between'}>
        <FieldGroup>
          <div className={'grid grid-cols-1 gap-6'}>
            <Controller
              name="rating"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-rating">امتیاز شما</FieldLabel>
                  <Rating
                    {...field}
                    iconSize="h-8 w-8"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="comment"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-comment">نظر شما (اختیاری)</FieldLabel>
                  <Textarea
                    {...field}
                    id="form-rhf-demo-comment"
                    aria-invalid={fieldState.invalid}
                    placeholder="تجربه خود را از این محصول بنویسید..."
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>
        </FieldGroup>
      </form>
    </Dialog>
  )
}
