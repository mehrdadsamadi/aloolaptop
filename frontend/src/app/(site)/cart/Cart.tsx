'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ArrowRight, CreditCard, Minus, Plus, ShoppingBag, ShoppingCart, TicketPercent, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { applyCouponToCart, clearCart, getCart, removeProductFromCart, updateCart } from '@/actions/cart.action'
import { showError } from '@/lib/utils'
import { useLoading } from '@/hooks/useLoading'
import { Skeleton } from '@/components/ui/skeleton'
import { useConfirm } from '@/hooks/useConfirm'
import LinkButton from '@/components/common/linkButton'

interface CartItem {
  productId: string
  name: string
  image: string
  unitPrice: number
  discountPercent: number
  discountExpiresAt: Date
  finalUnitPrice: number
  quantity: number
  stock: number
  totalPrice: number
  _id: string
  createdAt: string
  updatedAt: string
}

export interface CartData {
  _id: string
  userId: string
  items: CartItem[]
  totalItems: number
  totalQuantity: number
  finalItemsPrice: number
  couponId: string
  discountAmount: number
  totalPrice: number
  createdAt: string
  updatedAt: string
}

export default function Cart() {
  const router = useRouter()
  const { showLoading, hideLoading } = useLoading()
  const { confirm } = useConfirm()

  const [cart, setCart] = useState<CartData | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  const [couponCode, setCouponCode] = useState('')
  const [applyingCoupon, setApplyingCoupon] = useState(false)

  // دریافت اطلاعات سبد خرید
  useEffect(() => {
    fetchCart()
  }, [])

  const fetchCart = async () => {
    try {
      setLoading(true)
      const response = await getCart()

      setCart(response)
    } catch (error) {
      toast.error('خطا در دریافت سبد خرید')
    } finally {
      setLoading(false)
    }
  }

  // به‌روزرسانی تعداد محصول
  const updateQuantity = async (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return

    const item = cart?.items.find((item) => item.productId === productId)
    if (!item) return

    try {
      setUpdating(productId)
      const res = await updateCart({ productId: productId, quantity: newQuantity })

      if (res?.ok === false) {
        showError(res.messages)
        return
      }

      setCart(res.cart)
      toast.success(res?.message)
    } catch (error) {
      toast.error('خطا در به‌روزرسانی تعداد')
    } finally {
      setUpdating(null)
    }
  }

  // حذف محصول از سبد
  const removeItem = async (itemId: string) => {
    try {
      showLoading()

      const item = cart?.items.find((item) => item._id === itemId)
      if (!item) return

      const res = await removeProductFromCart(itemId)

      if (res?.ok === false) {
        showError(res.messages)
        return
      }

      setCart(res.cart)
      toast.success('محصول از سبد خرید حذف شد')
    } catch (error) {
      toast.error('خطا در حذف محصول')
    } finally {
      hideLoading()
    }
  }

  // اعمال کد تخفیف
  const applyCoupon = async () => {
    if (!couponCode.trim()) return

    try {
      setApplyingCoupon(true)

      const res = await applyCouponToCart(couponCode)

      if (res?.ok === false) {
        showError(res.messages)
        return
      }

      setCart(res.cart)

      toast.success(res?.message)

      setCouponCode('')
    } catch (error) {
      toast.error('خطا در اعمال کد تخفیف')
    } finally {
      setApplyingCoupon(false)
    }
  }

  // خالی کردن سبد خرید
  const handleClearCart = async () => {
    try {
      showLoading()

      const res = await clearCart()

      if (res?.ok === false) {
        showError(res.messages)
        return
      }

      setCart(null)
      toast.success(res?.message)
    } catch (error) {
      toast.error('خطا در خالی کردن سبد خرید')
    } finally {
      hideLoading()
    }
  }

  // محاسبه تخفیف کل
  const calculateTotalDiscount = () => {
    return cart?.items.reduce((total, item) => {
      const originalPrice = item.unitPrice * item.quantity
      const discountedPrice = item.finalUnitPrice * item.quantity
      return total + (originalPrice - discountedPrice)
    }, 0)
  }

  const totalDiscount = calculateTotalDiscount()

  const calculateTotalPrice = () => {
    return cart?.items.reduce((total, item) => {
      const originalPrice = item.unitPrice * item.quantity

      return total + originalPrice
    }, 0)
  }

  const totalPrice = calculateTotalPrice()

  if (loading) {
    return <CartSkeleton />
  }

  if ((!cart || cart.items.length === 0) && !loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <ShoppingCart className="w-12 h-12 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold mb-4">سبد خرید شما خالی است</h1>
          <p className="text-gray-600 mb-8">می‌توانید از فروشگاه ما محصولات متنوعی را انتخاب کنید و به سبد خرید اضافه کنید.</p>
          <Button
            onClick={() => router.push('/')}
            className="gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            مشاهده محصولات
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push('/')}
          className="hover:bg-gray-100"
        >
          <ArrowRight className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold">سبد خرید</h1>
        <div className="flex items-center gap-2 mr-auto">
          <Badge variant="secondary">{cart?.totalItems} کالا</Badge>
          <Badge variant="outline">{cart?.totalQuantity} عدد</Badge>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* لیست محصولات */}
        <div className="lg:col-span-2 space-y-4">
          {cart?.items.map((item) => {
            const stock = item?.stock || 0
            const isLowStock = stock <= 5
            const isOutOfStock = stock === 0
            const hasDiscount = item?.discountPercent > 0 && (!item?.discountExpiresAt || new Date(item?.discountExpiresAt) > new Date())

            return (
              <Card
                key={item._id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* تصویر محصول */}
                    <div className="relative">
                      <Avatar className="w-24 h-24 rounded-lg border">
                        <AvatarImage
                          src={item.image}
                          alt={item.name}
                          className="object-cover"
                        />
                        <AvatarFallback className="text-lg">{item.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {hasDiscount && <Badge className="absolute -top-2 -right-2 bg-red-500">%{item.discountPercent}</Badge>}
                    </div>

                    {/* اطلاعات محصول */}
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-1 line-clamp-2">{item.name}</h3>
                          <div className="flex items-center gap-2">
                            <Badge variant={isOutOfStock ? 'destructive' : isLowStock ? 'default' : 'secondary'}>
                              {isOutOfStock ? 'ناموجود' : isLowStock ? `تنها ${stock} عدد باقی مانده` : 'موجود'}
                            </Badge>
                            {item.unitPrice !== item.finalUnitPrice && (
                              <Badge
                                variant="outline"
                                className="text-green-600"
                              >
                                تخفیف دار
                              </Badge>
                            )}
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-gray-500 hover:text-red-600 hover:bg-red-50 self-start sm:self-center"
                          onClick={() =>
                            confirm({
                              title: 'حذف محصول از سبد',
                              description: `آیا از حذف "${item.name}" از سبد خرید مطمئن هستید؟`,
                              confirmText: 'حذف محصول',
                              cancelText: 'انصراف',
                              onConfirm: () => removeItem(item._id),
                            })
                          }
                        >
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      </div>

                      {/* قیمت‌ها */}
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        <div className="flex items-center gap-1">
                          <span className="text-2xl font-bold text-primary">{item.finalUnitPrice.toLocaleString('fa-IR')}</span>
                          <span className="text-sm text-gray-500">تومان</span>
                        </div>

                        {item.unitPrice !== item.finalUnitPrice && (
                          <>
                            <span className="text-lg text-gray-400 line-through">{item.unitPrice.toLocaleString('fa-IR')}</span>
                            <div className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded">{item.discountPercent}% تخفیف</div>
                          </>
                        )}
                      </div>

                      {/* کنترل تعداد و قیمت کل */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            disabled={item.quantity <= 1 || isOutOfStock}
                            loading={updating === item._id}
                            className="h-10 w-10 rounded-full"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>

                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => {
                              const value = parseInt(e.target.value)
                              if (!isNaN(value) && value > 0) {
                                updateQuantity(item.productId, value)
                              }
                            }}
                            disabled={updating === item._id || isOutOfStock}
                            className="w-20 text-center font-medium [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            min="1"
                            max={stock}
                          />

                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            disabled={item.quantity >= stock || isOutOfStock}
                            loading={updating === item._id}
                            className="h-10 w-10 rounded-full"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>

                          {updating === item._id && (
                            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                          )}
                        </div>

                        <div className="text-left sm:text-right">
                          <div className="text-sm text-gray-500 mb-1">قیمت کل این کالا</div>
                          <div className="text-xl font-bold text-primary">
                            {item.totalPrice.toLocaleString('fa-IR')}
                            <span className="text-sm font-normal text-gray-500 mr-1">تومان</span>
                          </div>
                          {item.unitPrice !== item.finalUnitPrice && (
                            <div className="text-sm text-green-600 mt-1">
                              صرفه‌جویی: {(item.unitPrice * item.quantity - item.totalPrice).toLocaleString('fa-IR')} تومان
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}

          {/* دکمه خالی کردن سبد */}
          <div className="flex justify-end pt-4">
            <Button
              variant="outline"
              className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 hover:border-red-300"
              onClick={() =>
                confirm({
                  title: 'خالی کردن سبد خرید',
                  description: `آیا از خالی کردن تمامی محصولات سبد خرید مطمئن هستید؟ این عمل قابل بازگشت نیست.`,
                  confirmText: 'بله، خالی کن',
                  cancelText: 'انصراف',
                  onConfirm: handleClearCart,
                })
              }
            >
              <Trash2 className="w-4 h-4 ml-2" />
              خالی کردن سبد خرید
            </Button>
          </div>
        </div>

        {/* خلاصه سفارش */}
        <div className="space-y-6">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TicketPercent className="w-5 h-5" />
                خلاصه سفارش
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* کد تخفیف */}
              <div className="space-y-3">
                <div className="text-sm font-medium">کد تخفیف</div>
                <div className="flex gap-2">
                  <Input
                    placeholder="کد تخفیف را وارد کنید"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    disabled={applyingCoupon || !!cart?.couponId}
                    className="flex-1"
                  />
                  <Button
                    onClick={applyCoupon}
                    disabled={applyingCoupon || !couponCode.trim() || !!cart?.couponId}
                    variant="secondary"
                    className="whitespace-nowrap"
                  >
                    {applyingCoupon ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : cart?.couponId ? (
                      'اعمال شده'
                    ) : (
                      'اعمال کد'
                    )}
                  </Button>
                </div>
                {cart?.couponId && <div className="text-sm text-green-600 bg-green-50 p-2 rounded">کد تخفیف با موفقیت اعمال شد</div>}
              </div>

              <Separator />

              {/* جزئیات قیمت */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">جمع کالاها ({cart?.totalQuantity} عدد)</span>
                  <span className="font-medium">{totalPrice?.toLocaleString('fa-IR')} تومان</span>
                </div>

                {!!totalDiscount && totalDiscount > 0 && (
                  <div className="flex justify-between items-center text-green-600">
                    <span>تخفیف محصولات</span>
                    <span>- {totalDiscount?.toLocaleString('fa-IR')} تومان</span>
                  </div>
                )}

                {!!cart?.discountAmount && cart?.discountAmount > 0 && (
                  <div className="flex justify-between items-center text-green-600">
                    <span>تخفیف کد تخفیف</span>
                    <span>- {cart?.discountAmount.toLocaleString('fa-IR')} تومان</span>
                  </div>
                )}

                <Separator />

                <div className="flex justify-between items-center text-lg font-bold">
                  <span>مبلغ قابل پرداخت</span>
                  <div className="flex flex-col items-end">
                    <span className="text-2xl text-primary">{cart?.totalPrice.toLocaleString('fa-IR')}</span>
                    <span className="text-sm font-normal text-gray-500">تومان</span>
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex-col gap-3">
              <Button
                className="w-full h-12"
                onClick={() => router.push('/checkout/address')}
                disabled={cart?.items.length === 0}
                size="lg"
              >
                <CreditCard className="w-5 h-5 ml-2" />
                ادامه جهت انتخاب آدرس ارسال
              </Button>

              <LinkButton
                variant="outline"
                className="w-full"
                href={'/'}
              >
                <ShoppingBag className="w-4 h-4 ml-2" />
                ادامه خرید
              </LinkButton>
            </CardFooter>
          </Card>

          {/* اطلاعات تکمیلی */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 shrink-0"></div>
                  <div>
                    <p className="text-sm font-medium mb-1">تضمین بازگشت کالا</p>
                    <p className="text-xs text-gray-600">تا ۷ روز پس از تحویل امکان بازگشت کالا وجود دارد</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 shrink-0"></div>
                  <div>
                    <p className="text-sm font-medium mb-1">تحویل سریع</p>
                    <p className="text-xs text-gray-600">ارسال رایگان برای سفارش‌های بالای ۵۰۰,۰۰۰ تومان</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 shrink-0"></div>
                  <div>
                    <p className="text-sm font-medium mb-1">پشتیبانی ۲۴ ساعته</p>
                    <p className="text-xs text-gray-600">در صورت وجود هرگونه سوال با پشتیبانی تماس بگیرید</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function CartSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-8">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-6 w-20 rounded-full mr-auto" />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {[1, 2].map((i) => (
            <Card
              key={i}
              className="overflow-hidden"
            >
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <Skeleton className="w-24 h-24 rounded-lg" />
                  <div className="flex-1 space-y-4">
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <Skeleton className="h-8 w-40" />
                    <div className="flex justify-between items-center pt-4">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <Skeleton className="h-10 w-20" />
                        <Skeleton className="h-10 w-10 rounded-full" />
                      </div>
                      <Skeleton className="h-8 w-32" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <div className="flex gap-2">
                  <Skeleton className="h-10 flex-1" />
                  <Skeleton className="h-10 w-24" />
                </div>
              </div>
              <Skeleton className="h-px w-full" />
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex justify-between"
                  >
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                ))}
              </div>
              <Skeleton className="h-px w-full" />
              <div className="flex justify-between">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-8 w-40" />
              </div>
            </CardContent>
            <CardFooter>
              <Skeleton className="h-12 w-full" />
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
