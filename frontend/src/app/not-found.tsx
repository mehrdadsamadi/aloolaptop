// app/not-found.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, HelpCircle, Home, Package, RefreshCw, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import LinkButton from '@/components/common/linkButton'

export default function NotFound() {
  const router = useRouter()
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 flex items-center justify-center p-4">
      {/* Background Decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-blue-500/5 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-purple-500/5 blur-3xl" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-2xl">
        {/* Animated 404 */}
        <div
          className="text-center mb-8"
          style={{
            transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
            transition: 'transform 0.1s ease-out',
          }}
        >
          <h1 className="text-[12rem] md:text-[15rem] font-black leading-none bg-linear-to-br from-primary via-purple-500 to-blue-500 bg-clip-text text-transparent select-none">
            404
          </h1>
          <div className="relative -mt-8">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-32 w-32 rounded-full border-4 border-primary/20 animate-ping" />
            </div>
            <p className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-200">صفحه‌ای که دنبالشی گم شده!</p>
          </div>
        </div>

        {/* Error Message Card */}
        <Card className="border-2 shadow-xl backdrop-blur-sm bg-white/80 dark:bg-gray-900/80">
          <CardContent className="p-8">
            <div className="space-y-6">
              {/* Icon Grid */}
              <div className="grid grid-cols-4 gap-4 mb-8">
                {[Package, Search, HelpCircle, RefreshCw].map((Icon, index) => (
                  <div
                    key={index}
                    className="aspect-square rounded-2xl bg-linear-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center animate-pulse"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <Icon className="h-8 w-8 text-gray-600 dark:text-gray-400" />
                  </div>
                ))}
              </div>

              {/* Description */}
              <div className="text-center space-y-2">
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  متأسفیم! صفحه‌ای که به دنبال آن هستید وجود ندارد یا به آدرس دیگری منتقل شده است.
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  ممکن است آدرس را اشتباه وارد کرده باشید یا صفحه مورد نظر حذف شده باشد.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <Button
                  className="w-full gap-2 h-12"
                  onClick={() => router.back()}
                >
                  <ArrowRight className="h-5 w-5" />
                  بازگشت به صفحه قبل
                </Button>

                <LinkButton
                  variant="outline"
                  className="w-full gap-2 h-12 border-2 hover:bg-primary/5"
                  href={'/'}
                >
                  <Home className="h-5 w-5" />
                  صفحه اصلی
                </LinkButton>
              </div>

              {/* Quick Links */}
              <div className="pt-6 border-t">
                <p className="text-sm text-center text-gray-500 dark:text-gray-500 mb-4">شاید این صفحات به کارت بیاد:</p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Link
                    href="/products"
                    className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-primary hover:text-white transition-colors"
                  >
                    🛍️ همه محصولات
                  </Link>
                  <Link
                    href="/categories"
                    className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-primary hover:text-white transition-colors"
                  >
                    📂 دسته‌بندی‌ها
                  </Link>
                  <Link
                    href="/blog"
                    className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-primary hover:text-white transition-colors"
                  >
                    📝 وبلاگ
                  </Link>
                  <Link
                    href="/contact"
                    className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-primary hover:text-white transition-colors"
                  >
                    📞 تماس با ما
                  </Link>
                </div>
              </div>

              {/* Fun Fact */}
              <div className="text-center">
                <p className="text-xs text-gray-400 dark:text-gray-600">
                  💡 جالبه بدونید: صفحه ۴۰۴ به خاطر اینکه اتاق ۴۰۴ در تیم برنرز لی (مخترع وب) وجود نداشت، این اسم رو گرفت!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
