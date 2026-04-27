// app/products/[slug]/product-details-client.tsx
'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { formatPrice, getRemainingTime, showError } from '@/lib/utils'
import { IProduct, ProductCondition } from '@/types/admin/product.type'
import { addToCart } from '@/actions/cart.action'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Heart,
  ShoppingCart,
  Shuffle,
  Shield,
  Truck,
  RefreshCw,
  Clock,
  Star,
  CheckCircle,
  AlertCircle,
  Minus,
  Plus,
  Share2,
  ChevronRight,
} from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { IImageArchive } from '@/types/admin/imageArchive.type'

interface ProductDetailsClientProps {
  product: IProduct
}

export default function ProductDetailsClient({ product }: ProductDetailsClientProps) {
  const router = useRouter()
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(product.images[0])

  const hasDiscount = product?.discountPercent > 0 && (!product?.discountExpiresAt || new Date(product?.discountExpiresAt) > new Date())
  const isOutOfStock = product?.stock === 0
  const isLowStock = product?.stock > 0 && product?.stock <= 5
  const discountTimeLeft = product?.discountExpiresAt ? getRemainingTime(new Date(product.discountExpiresAt)) : null

  const handleAddToCart = async () => {
    if (isOutOfStock) {
      toast.error('این محصول موجود نیست')
      return
    }

    try {
      setIsAddingToCart(true)
      const res = await addToCart({ productId: product?._id, quantity })

      if (res?.ok === false) {
        showError(res.messages)
        return
      }

      toast.success(res?.message || 'محصول به سبد خرید اضافه شد')
    } catch (error) {
      console.error('خطا در اضافه کردن به سبد خرید', error)
      toast.error('خطا در اضافه کردن به سبد خرید')
    } finally {
      setIsAddingToCart(false)
    }
  }

  const handleToggleWishlist = () => {
    setIsWishlisted(!isWishlisted)
    // API call for wishlist
    toast.success(isWishlisted ? 'محصول از علاقه‌مندی‌ها حذف شد' : 'محصول به علاقه‌مندی‌ها اضافه شد')
  }

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* دکمه بازگشت */}
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-6 gap-2"
      >
        <ChevronRight className="h-4 w-4" />
        بازگشت
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* سمت راست - گالری تصاویر */}
        <div className="space-y-4">
          {/* تصویر اصلی */}
          <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden border">
            <Image
              src={selectedImage?.url || product.images[0]?.url}
              alt={product.name}
              fill
              className="object-contain p-4"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />

            {/* برچسب‌ها */}
            <div className="absolute top-4 right-4 flex gap-2">
              {isOutOfStock && (
                <Badge
                  variant="destructive"
                  className="text-xs"
                >
                  ناموجود
                </Badge>
              )}
              {product.condition === ProductCondition.NEW && !isOutOfStock && (
                <Badge className="bg-success text-white text-xs">آکبند</Badge>
              )}
              {product.condition === ProductCondition.USED && !isOutOfStock && (
                <Badge
                  variant="secondary"
                  className="text-xs"
                >
                  استوک
                </Badge>
              )}
              {hasDiscount && !isOutOfStock && <Badge className="bg-error text-white text-xs">{product.discountPercent}٪ تخفیف</Badge>}
            </div>
          </div>

          {/* تصاویر کوچک */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(image)}
                  className={`
                    relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all cursor-pointer
                    ${selectedImage?.url === image.url ? 'border-primary ring-2 ring-primary/20' : 'border-gray-200 hover:border-gray-300'}
                  `}
                >
                  <Image
                    src={image.url}
                    alt={`${product.name} - ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* سمت چپ - اطلاعات محصول */}
        <div className="space-y-6">
          {/* عنوان و امتیاز */}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-3">{product.name}</h1>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                {product.rate ? (
                  <>
                    <span className="font-semibold">{product.rate || 'محصول جدید'}</span>
                    <span className="text-muted-foreground text-sm">(امتیاز)</span>
                  </>
                ) : (
                  <span className="font-semibold">محصول جدید</span>
                )}
              </div>
              <Separator
                orientation="vertical"
                className="h-5"
              />
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>دسته‌بندی:</span>
                <Link
                  href={`/categories/${product.categoryId?.slug}`}
                  className="text-primary hover:underline"
                >
                  {product.categoryId.name}
                </Link>
              </div>
            </div>
          </div>

          {/* قیمت */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-2">
            {hasDiscount && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">قیمت اصلی:</span>
                <span className="text-gray-500 line-through">{formatPrice(product.price)} تومان</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">قیمت نهایی:</span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl md:text-3xl font-bold text-success">{formatPrice(product.finalPrice)}</span>
                <span className="text-sm text-muted-foreground">تومان</span>
              </div>
            </div>
            {hasDiscount && discountTimeLeft && (
              <div className="flex items-center gap-2 text-sm text-error bg-error/10 p-2 rounded-lg">
                <Clock className="h-4 w-4" />
                <span>زمان باقی‌مانده تخفیف: {discountTimeLeft}</span>
              </div>
            )}
          </div>

          {/* وضعیت موجودی */}
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2">
              {isOutOfStock ? (
                <>
                  <AlertCircle className="h-5 w-5 text-error" />
                  <span className="text-error font-medium">ناموجود</span>
                </>
              ) : isLowStock ? (
                <>
                  <AlertCircle className="h-5 w-5 text-warning" />
                  <span className="text-warning font-medium">تنها {product.stock} عدد در انبار باقی مانده</span>
                </>
              ) : (
                <>
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span className="text-success font-medium">موجود در انبار</span>
                </>
              )}
            </div>
            <span className="text-sm text-muted-foreground">کد محصول: {product._id.slice(-8)}</span>
          </div>

          {/* ویژگی‌ها */}
          {product.attributes.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">مشخصات فنی</h3>
              <div className="grid grid-cols-2 gap-3">
                {product.attributes.slice(0,4).map((attr) => (
                  <div
                    key={attr._id}
                    className="flex justify-between p-2 bg-gray-50 rounded-lg"
                  >
                    <span className="text-sm text-muted-foreground">{attr.label}:</span>
                    <span className="text-sm font-medium">{attr.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* گارانتی و خدمات */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 p-3 border rounded-lg">
              <Shield className="h-5 w-5 text-primary" />
              <span className="text-sm">گارانتی اصالت کالا</span>
            </div>
            <div className="flex items-center gap-2 p-3 border rounded-lg">
              <Truck className="h-5 w-5 text-primary" />
              <span className="text-sm">ارسال سریع</span>
            </div>
            <div className="flex items-center gap-2 p-3 border rounded-lg">
              <RefreshCw className="h-5 w-5 text-primary" />
              <span className="text-sm">۷ روز ضمانت بازگشت</span>
            </div>
            <div className="flex items-center gap-2 p-3 border rounded-lg">
              <Clock className="h-5 w-5 text-primary" />
              <span className="text-sm">پشتیبانی ۲۴ ساعته</span>
            </div>
          </div>

          {/* انتخاب تعداد و دکمه‌ها */}
          {!isOutOfStock && (
            <div className="flex items-center gap-4">
              <div className="flex items-center border rounded-lg">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="p-2 hover:bg-gray-100 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= product.stock}
                  className="p-2 hover:bg-gray-100 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <span className="text-sm text-muted-foreground">حداکثر {product.stock} عدد</span>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              loading={isAddingToCart}
              size="lg"
              className="flex-1 gap-2"
            >
              <ShoppingCart className="h-5 w-5" />
              {isOutOfStock ? 'ناموجود' : 'افزودن به سبد خرید'}
            </Button>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleToggleWishlist}
                    className="gap-2"
                  >
                    <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-error text-error' : ''}`} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isWishlisted ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="lg"
                  >
                    <Shuffle className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>مقایسه</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="lg"
                  >
                    <Share2 className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>اشتراک‌گذاری</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

      {/* توضیحات محصول */}
      <div className="mt-12">
        <Tabs
          defaultValue="description"
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger className='cursor-pointer' value="description">توضیحات</TabsTrigger>
            <TabsTrigger className='cursor-pointer' value="details">مشخصات فنی</TabsTrigger>
            <TabsTrigger className='cursor-pointer' value="reviews">نظرات</TabsTrigger>
          </TabsList>
          <TabsContent
            value="description"
            className="mt-6"
          >
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{product.description}</p>
            </div>
          </TabsContent>
          <TabsContent
            value="details"
            className="mt-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {product.attributes.map((attr) => (
                <div
                  key={attr._id}
                  className="flex justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <span className="font-medium">{attr.label}</span>
                  <span className="text-muted-foreground">{attr.value}</span>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent
            value="reviews"
            className="mt-6"
          >
            <div className="text-center py-12 rounded-lg bg-gray-50">
              <p className="text-muted-foreground">هنوز نظری ثبت نشده است</p>
              <Button
                variant="outline"
                className="mt-4"
              >
                ثبت اولین نظر
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
