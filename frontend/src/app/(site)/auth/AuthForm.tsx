'use client'

import { ArrowLeftIcon, GalleryVerticalEnd } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSeparator } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Activity, useEffect, useState } from 'react'
import { checkOtp, sendOtp } from '@/actions/auth.action'
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp'
import { redirect } from 'next/navigation'
import { Spinner } from '@/components/ui/spinner'

export default function AuthForm() {
  const [authStep, setAuthStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [timer, setTimer] = useState(120) // 2 دقیقه

  const [mobile, setMobile] = useState('')
  const [code, setCode] = useState('')

  useEffect(() => {
    if (authStep !== 2) return

    if (timer === 0) return

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [authStep, timer])

  const sendOtpHandler = async (e: React.FormEvent) => {
    e.preventDefault()

    setLoading(true)

    const res = await sendOtp(mobile)
    console.log('res', res)

    setLoading(false)

    setAuthStep(2)
    setTimer(120)
  }

  const checkOtpHandler = async (e: React.FormEvent) => {
    e.preventDefault()

    setLoading(true)

    const res = await checkOtp({ mobile, code })
    console.log('res', res)
    setLoading(false)

    redirect('/')
  }

  return (
    <div className={'flex flex-col gap-6'}>
      <form onSubmit={authStep === 1 ? sendOtpHandler : checkOtpHandler}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="flex size-8 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-6" />
            </div>
            <h1 className="text-xl font-bold">به الو لپتاپ خوش آمدید</h1>
            <FieldDescription>لطفا شماره موبایل خود را وارد کنید</FieldDescription>
          </div>

          <div className={'flex items-center justify-center w-full'}>
            <Activity mode={authStep === 1 ? 'visible' : 'hidden'}>
              <Field>
                <FieldLabel htmlFor="mobile">موبایل</FieldLabel>
                <Input
                  name={'mobile'}
                  autoFocus
                  id="mobile"
                  type="tel"
                  placeholder="09xx xxx xxxx"
                  required
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                />
              </Field>
            </Activity>

            <Activity mode={authStep === 2 ? 'visible' : 'hidden'}>
              {authStep === 2 && (
                <Field dir={'ltr'}>
                  <InputOTP
                    autoFocus
                    name={'code'}
                    value={code}
                    onChange={(value) => setCode(value)}
                    required
                    id="code"
                    maxLength={5}
                    containerClassName={'justify-center'}
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
              )}
            </Activity>
          </div>

          <Field
            orientation={'horizontal'}
            className={'flex justify-center'}
          >
            <Button
              disabled={loading}
              type={'submit'}
              className={'cursor-pointer flex-1'}
            >
              {loading && <Spinner />}
              {authStep === 1 ? 'ارسال کد' : 'ورود'}
            </Button>

            {authStep !== 1 && (
              <Button
                className={'cursor-pointer'}
                variant="ghost"
                type="button"
                disabled={timer > 0}
                onClick={() => setAuthStep(1)}
              >
                {timer > 0 ? (
                  <span className="">
                    {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
                  </span>
                ) : (
                  <>
                    تغییر موبایل
                    <ArrowLeftIcon />
                  </>
                )}
              </Button>
            )}
          </Field>

          <FieldSeparator className={'flex items-center'}>
            <Button
              className={'cursor-pointer'}
              variant={'ghost'}
              size={'sm'}
            >
              قوانین و مقررات
            </Button>
          </FieldSeparator>
        </FieldGroup>
      </form>

      {authStep === 2 && (
        <FieldDescription className="px-6 text-center">با کلیک بر روی ورود ، شما قوانین و مقررات مارا پذیرفته اید.</FieldDescription>
      )}
    </div>
  )
}
