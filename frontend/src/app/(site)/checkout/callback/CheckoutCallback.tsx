// app/(site)/checkout/callback/CheckoutCallback.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AlertCircle, CheckCircle, Copy, ExternalLink, Home, RefreshCw, ShoppingBag, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { formatDate } from '@/lib/utils'

interface CheckoutCallbackProps {
  success: boolean
  message: string
  trackingCode?: string
  gatewayUrl?: string
}

export default function CheckoutCallback({ success, message, gatewayUrl, trackingCode }: CheckoutCallbackProps) {
  const router = useRouter()

  useEffect(() => {
    if (success) {
      window.scrollTo(0, 0)
    }
  }, [success])

  const handleCopyTrackingCode = () => {
    if (trackingCode) {
      navigator.clipboard.writeText(trackingCode)
      toast.success('کد رهگیری کپی شد')
    }
  }

  // حالت موفق
  if (success) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          {/* Header Success */}
          <div className="text-center mb-6">
            <div className="relative inline-block mb-3">
              <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
              <div className="absolute -top-1 -right-1">
                <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-green-700 mb-1">پرداخت موفق</h1>
            <p className="text-green-600">{message}</p>
          </div>

          {/* Main Card */}
          <Card className="border-green-200 shadow-lg">
            <CardHeader className="space-y-3 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">وضعیت سفارش</h3>
                  <p className="text-sm text-muted-foreground">سفارش شما با موفقیت ثبت شد</p>
                </div>
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100 px-3 py-1">
                  <CheckCircle className="h-3 w-3 ml-1" />
                  تایید شده
                </Badge>
              </div>
              <Separator />
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Order Details */}
              <div className="space-y-2">
                <h4 className="font-medium">جزئیات سفارش</h4>
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">تاریخ:</span>
                    <span>{formatDate(String(new Date()))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">وضعیت پرداخت:</span>
                    <span className="text-green-600 font-medium">پرداخت شده</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">روش پرداخت:</span>
                    <span>درگاه بانکی</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Tracking Code */}
              <div className="space-y-2">
                <h4 className="font-medium">پیگیری سفارش</h4>
                <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="text-xs text-muted-foreground">کد رهگیری:</div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopyTrackingCode}
                      className="h-6 px-2 text-xs"
                    >
                      <Copy className="h-3 w-3 ml-1" />
                      کپی
                    </Button>
                  </div>
                  <div className="bg-white p-2 rounded border">
                    <code className="text-lg font-bold text-center font-mono block">{trackingCode}</code>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">این کد را نزد خود نگه دارید.</p>
                </div>
              </div>

              {/* Info Alert */}
              {/*<Alert className="bg-blue-50 border-blue-200 py-2">*/}
              {/*  <AlertCircle className="h-3 w-3 text-blue-600 mt-0.5" />*/}
              {/*  <AlertDescription className="text-blue-800 text-xs">رسید پرداخت به ایمیل شما ارسال خواهد شد.</AlertDescription>*/}
              {/*</Alert>*/}
            </CardContent>

            <CardFooter className="flex flex-col gap-2 pt-4">
              <Button
                className="w-full"
                onClick={() => router.push('/orders')}
              >
                <ShoppingBag className="h-4 w-4 ml-2" />
                مشاهده سفارشات
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push('/')}
              >
                <Home className="h-4 w-4 ml-2" />
                صفحه اصلی
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    )
  }

  // حالت ناموفق
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header Failed */}
        <div className="text-center mb-6">
          <div className="relative inline-block mb-3">
            <div className="h-20 w-20 rounded-full bg-red-100 flex items-center justify-center">
              <XCircle className="h-12 w-12 text-red-600" />
            </div>
            <div className="absolute -top-1 -right-1">
              <div className="h-8 w-8 rounded-full bg-red-500 flex items-center justify-center">
                <span className="text-white text-xs font-bold">!</span>
              </div>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-red-700 mb-1">پرداخت ناموفق</h1>
          <p className="text-red-600">{message}</p>
        </div>

        {/* Main Card */}
        <Card className="border-red-200 shadow-lg">
          <CardHeader className="space-y-3 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">وضعیت پرداخت</h3>
                <p className="text-sm text-muted-foreground">مشکلی در فرآیند پرداخت رخ داده است</p>
              </div>
              <Badge
                variant="destructive"
                className="px-3 py-1"
              >
                <XCircle className="h-3 w-3 ml-1" />
                ناموفق
              </Badge>
            </div>
            <Separator />
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Error Details */}
            <div className="space-y-2">
              <h4 className="font-medium">علت احتمالی</h4>
              <div className="space-y-1.5 text-sm">
                <div className="flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                  <span>عدم تأیید پرداخت توسط بانک</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                  <span>کمبود موجودی حساب بانکی</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                  <span>اتمام زمان پرداخت</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Refund Info */}
            <Alert
              variant="destructive"
              className="py-2"
            >
              <AlertCircle className="h-3 w-3 mt-0.5" />
              <div>
                <AlertTitle className="text-xs mb-0.5">توجه</AlertTitle>
                <AlertDescription className="text-xs">در صورت کسر وجه، مبلغ طی ۷۲ ساعت بازگردانده می‌شود.</AlertDescription>
              </div>
            </Alert>

            {/* Retry Payment */}
            {gatewayUrl && (
              <div className="space-y-2">
                <h4 className="font-medium">تلاش مجدد پرداخت</h4>
                <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                  <p className="text-xs text-yellow-800 mb-2">می‌توانید مجدداً برای پرداخت اقدام کنید:</p>
                  <Button
                    className="w-full"
                    onClick={() => (window.location.href = gatewayUrl)}
                  >
                    <RefreshCw className="h-4 w-4 ml-2" />
                    تلاش مجدد
                    <ExternalLink className="h-3 w-3 mr-2" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex flex-col gap-2 pt-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push('/cart')}
            >
              <ShoppingBag className="h-4 w-4 ml-2" />
              سبد خرید
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push('/')}
            >
              <Home className="h-4 w-4 ml-2" />
              صفحه اصلی
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
