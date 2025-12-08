'use client'

import { Button } from '@/components/ui/button'
import { Field, FieldDescription, FieldError, FieldGroup, FieldSet } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useEffect, useState } from 'react'
import { checkOtp, sendOtp } from '@/actions/auth.action'
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp'
import { redirect } from 'next/navigation'
import { Spinner } from '@/components/ui/spinner'
import { MobileSchemaType, mobileValidator, OtpSchemaType, otpValidator } from '@/validators/auth.validator'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { GalleryVerticalEnd } from 'lucide-react'
import { toast } from 'sonner'
import { convertFaToEn } from '@/lib/utils'

export default function AuthForm() {
  const [authStep, setAuthStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [timer, setTimer] = useState(120)

  // ---------------------------
  // فرم مرحله 1 (شماره موبایل)
  // ---------------------------
  const mobileForm = useForm<MobileSchemaType>({
    resolver: zodResolver(mobileValidator),
    defaultValues: { mobile: '' },
  })

  // ---------------------------
  // فرم مرحله 2 (کد OTP)
  // ---------------------------
  const otpForm = useForm<OtpSchemaType>({
    resolver: zodResolver(otpValidator),
    defaultValues: { code: '' },
  })

  // ---------------------------
  // تایمر
  // ---------------------------
  useEffect(() => {
    if (authStep !== 2) return
    if (timer === 0) return

    const interval = setInterval(() => setTimer((p) => p - 1), 1000)
    return () => clearInterval(interval)
  }, [authStep, timer])

  // ---------------------------
  // مرحله 1 → ارسال OTP
  // ---------------------------
  const sendOtpHandler = async (data: MobileSchemaType) => {
    setLoading(true)

    const response = await sendOtp(data.mobile)

    setLoading(false)

    if (!response.success) {
      mobileForm.setError('mobile', {
        message: response.error,
      })

      return
    }

    setAuthStep(2)
    setTimer(120)
  }

  // ---------------------------
  // مرحله 2 → بررسی OTP
  // ---------------------------
  const checkOtpHandler = async (data: OtpSchemaType) => {
    setLoading(true)

    const response = await checkOtp({
      mobile: mobileForm.getValues('mobile'),
      code: data.code,
    })

    setLoading(false)

    if (!response.success) {
      otpForm.setError('code', {
        message: response.error,
      })
      return
    }

    toast.success('ورود موفقیت آمیز بود')

    redirect('/')
  }

  return (
    <div className={'flex flex-col gap-6'}>
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="flex size-8 items-center justify-center rounded-md">
          <GalleryVerticalEnd className="size-6" />
        </div>
        <h1 className="text-xl font-bold">به الو لپتاپ خوش آمدید</h1>
        <FieldDescription>{authStep === 1 ? 'لطفا شماره موبایل خود را وارد کنید' : 'کد ۵ رقمی ارسال شده را وارد کنید'}</FieldDescription>
      </div>

      {/* ---------------- مرحله ۱ ---------------- */}
      {authStep === 1 && (
        <form onSubmit={mobileForm.handleSubmit(sendOtpHandler)}>
          <FieldGroup>
            <FieldSet className={'gap-2'}>
              <Field dir="ltr">
                <Input
                  placeholder="09xx xxx xxxx"
                  {...mobileForm.register('mobile', {
                    setValueAs: convertFaToEn,
                  })}
                />
              </Field>

              <FieldError className={'text-rose-500'}>{mobileForm.formState.errors.mobile?.message}</FieldError>
            </FieldSet>

            <Button
              disabled={loading}
              className="w-full cursor-pointer"
            >
              {loading && <Spinner />}
              ارسال کد
            </Button>
          </FieldGroup>
        </form>
      )}

      {/* ---------------- مرحله ۲ ---------------- */}
      {authStep === 2 && (
        <form onSubmit={otpForm.handleSubmit(checkOtpHandler)}>
          <FieldGroup>
            <FieldSet className={'gap-2'}>
              <Field dir="ltr">
                <InputOTP
                  maxLength={5}
                  value={otpForm.watch('code')}
                  onChange={(val) => otpForm.setValue('code', convertFaToEn(val), { shouldValidate: true })}
                  containerClassName="justify-center"
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={1} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={4} />
                  </InputOTPGroup>
                </InputOTP>
              </Field>

              <FieldError className={'text-rose-500'}>{otpForm.formState.errors.code?.message}</FieldError>
            </FieldSet>

            <div className={'flex flex-col gap-2'}>
              <Button
                disabled={loading}
                className="w-full cursor-pointer"
              >
                {loading && <Spinner />}
                ورود
              </Button>

              <Button
                type="button"
                variant="ghost"
                disabled={timer > 0}
                onClick={() => setAuthStep(1)}
                className={`${timer <= 0 && 'cursor-pointer'}`}
              >
                {timer > 0 ? `${Math.floor(timer / 60)}:${String(timer % 60).padStart(2, '0')}` : 'تغییر موبایل'}
              </Button>
            </div>
          </FieldGroup>
        </form>
      )}
    </div>
  )
}
