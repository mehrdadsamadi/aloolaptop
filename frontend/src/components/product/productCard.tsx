// components/product/product-card.tsx
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Clock, Eye, Heart, ShoppingCart, Zap } from 'lucide-react'
import { cn, formatPrice, getRemainingTime } from '@/lib/utils'
import { IProduct } from '@/types/admin/product.type'
import { IconButton } from '@/components/common/iconButton'
import { RatingStars } from '@/components/common/ratingStart'

interface ProductCardProps {
  product: IProduct
  className?: string
  showActions?: boolean
  variant?: 'default' | 'compact'
  showSaleInfo?: boolean // نمایش اطلاعات فروش
}

export function ProductCard({ product, className, showActions = true, variant = 'default', showSaleInfo = false }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const mainImage = product?.images?.[0]
  const hasDiscount = product?.discountPercent > 0 && (!product?.discountExpiresAt || new Date(product?.discountExpiresAt) > new Date())
  const isOutOfStock = product?.stock === 0
  const isLowStock = product?.stock > 0 && product?.stock <= 5

  // تایمر تخفیف
  const discountTimeLeft = product?.discountExpiresAt ? getRemainingTime(new Date(product.discountExpiresAt)) : null

  // حالت compact برای نمایش متراکم
  const isCompact = variant === 'compact'

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // افزودن به سبد خرید
    console.log('Add to cart:', product?._id)
  }

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsWishlisted(!isWishlisted)
    // API call for wishlist
  }

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // باز کردن modal مشاهده سریع
  }

  const isNewArrival = (createdAt: string) => {
    return new Date(createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  }

  return (
    <Link
      href={`/products/${product?.slug}`}
      className="block h-full"
    >
      <Card
        className={cn(
          'group relative overflow-hidden transition-all duration-300 hover:shadow-lg',
          'border-gray-100 dark:border-gray-800 hover:border-primary/20',
          'h-full flex flex-col',
          isOutOfStock && 'opacity-70',
          isCompact && 'hover:shadow-md',
          className
        )}
      >
        {/* Top Badges Container */}
        <div className="absolute top-2 left-2 z-10 flex flex-wrap gap-1">
          {/* Discount Badge */}
          {hasDiscount && (
            <Badge className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-0 text-xs px-2 py-1">
              {product?.discountPercent}% تخفیف
            </Badge>
          )}

          {/* New Arrival Badge (اگر محصول جدید باشد) */}
          {product?.createdAt && isNewArrival(product?.createdAt) && (
            <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0 text-xs px-2 py-1">
              جدید
            </Badge>
          )}

          {/* Best Seller Badge */}
          {/*{showSaleInfo && product?.saleInfo?.totalSoldQuantity > 50 && (*/}
          {/*  <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white border-0 text-xs px-2 py-1">*/}
          {/*    پرفروش*/}
          {/*  </Badge>*/}
          {/*)}*/}
        </div>

        {/* Condition Badge */}
        <Badge
          variant="secondary"
          className="absolute top-2 right-2 z-10 capitalize text-xs bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm"
        >
          {product?.condition === 'new' ? 'نو' : product?.condition === 'used' ? 'کارکرده' : product?.condition}
        </Badge>

        {/* Image Container */}
        <div
          className={cn(
            'relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800',
            isCompact ? 'aspect-square' : 'aspect-[4/3]'
          )}
        >
          {mainImage ? (
            <Image
              src={mainImage?.url}
              alt={product?.name || 'محصول'}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              priority={false}
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Zap className="h-8 w-8 md:h-12 md:w-12 text-gray-300 dark:text-gray-600" />
            </div>
          )}

          {/* Quick Actions Overlay */}
          {showActions && (
            <div
              className="absolute inset-0 flex items-center justify-center gap-1 md:gap-2
                         bg-gradient-to-t from-black/60 via-black/30 to-transparent
                         opacity-0 transition-all duration-300 group-hover:opacity-100"
            >
              <IconButton
                onClick={handleAddToCart}
                variant="default"
                size={isCompact ? 'sm' : 'default'}
                className="bg-white hover:bg-white/90 text-gray-900 shadow-lg"
              >
                <ShoppingCart className="h-4 w-4" />
              </IconButton>
              <IconButton
                onClick={handleQuickView}
                variant="default"
                size={isCompact ? 'sm' : 'default'}
                className="bg-white hover:bg-white/90 text-gray-900 shadow-lg"
              >
                <Eye className="h-4 w-4" />
              </IconButton>
              <IconButton
                onClick={handleToggleWishlist}
                variant="default"
                size={isCompact ? 'sm' : 'default'}
                className={cn('bg-white hover:bg-white/90 text-gray-900 shadow-lg', isWishlisted && 'text-red-500')}
              >
                <Heart className={cn('h-4 w-4', isWishlisted && 'fill-current')} />
              </IconButton>
            </div>
          )}

          {/* Out of Stock Overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70">
              <Badge
                variant="destructive"
                className="px-3 py-1.5 text-sm font-medium"
              >
                ناموجود
              </Badge>
            </div>
          )}

          {/* Discount Timer */}
          {hasDiscount && discountTimeLeft && !discountTimeLeft.includes('منقضی') && (
            <div className="absolute bottom-2 left-2 right-2">
              <div className="flex items-center justify-center gap-1 bg-gradient-to-r from-red-500/90 to-red-600/90 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                <Clock className="h-3 w-3" />
                <span>{discountTimeLeft}</span>
              </div>
            </div>
          )}
        </div>

        <CardContent className={cn('p-3 md:p-4 flex-grow', isCompact && 'p-2')}>
          <div className="space-y-1.5 md:space-y-2">
            {/* Category */}
            {product?.categoryId?.name && (
              <div className="flex items-center justify-between">
                <Badge
                  variant="outline"
                  className="text-xs font-normal text-gray-500 dark:text-gray-400"
                >
                  {product?.categoryId?.name}
                </Badge>

                {/* فروش ماه */}
                {/*{showSaleInfo && product?.saleInfo && (*/}
                {/*  <div className="flex items-center gap-1 text-xs text-gray-500">*/}
                {/*    <TrendingUp className="h-3 w-3 text-green-500" />*/}
                {/*    <span>{product.saleInfo.totalSoldQuantity.toLocaleString('fa-IR')}+</span>*/}
                {/*  </div>*/}
                {/*)}*/}
              </div>
            )}

            {/* Product Name */}
            <h3
              className={cn(
                'font-semibold text-gray-900 dark:text-gray-100 transition-colors line-clamp-1',
                isCompact ? 'text-sm' : 'text-base'
              )}
            >
              {product?.name}
            </h3>

            {/* Description */}
            {!isCompact && product?.description && (
              <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{product?.description}</p>
            )}

            {/* Rating and Grade */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <RatingStars
                  rating={product?.rate || 0}
                  size={isCompact ? 'xs' : 'sm'}
                />
                <span className={cn('text-gray-500', isCompact ? 'text-xs' : 'text-sm')}>({product?.rate?.toFixed(1) || '0.0'})</span>
              </div>

              {product?.grade && (
                <Badge
                  variant="outline"
                  className={cn('text-gray-600 dark:text-gray-400', isCompact ? 'text-xs px-1.5 py-0' : 'text-xs')}
                >
                  {product.grade}
                </Badge>
              )}
            </div>

            {/* Low Stock Warning */}
            {isLowStock && (
              <div className="flex items-center gap-1 text-xs text-amber-600">
                <span>⚠️</span>
                <span>تنها {product.stock} عدد در انبار باقی مانده</span>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className={cn('p-3 md:p-4 pt-0', isCompact && 'p-2 pt-0')}>
          <div className="flex flex-col w-full gap-2">
            {/* Price Section */}
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col gap-0.5">
                <div className="flex items-baseline gap-1.5">
                  <span className={cn('font-bold text-gray-900 dark:text-gray-100', isCompact ? 'text-lg' : 'text-xl')}>
                    {formatPrice(product?.finalPrice || 0)}
                  </span>

                  {hasDiscount && (
                    <span className={cn('text-gray-500 line-through', isCompact ? 'text-xs' : 'text-sm')}>
                      {formatPrice(product?.price || 0)}
                    </span>
                  )}
                </div>

                {/* Saved Amount */}
                {hasDiscount && (
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <span>ذخیره</span>
                    <span className="font-medium">{formatPrice((product?.price || 0) - (product?.finalPrice || 0))}</span>
                  </div>
                )}
              </div>

              {/* Stock Progress Bar (برای حالت default) */}
              {!isCompact && product?.stock > 0 && (
                <div className="w-16">
                  <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        'h-full rounded-full',
                        product.stock > 10 ? 'bg-green-500' : product.stock > 5 ? 'bg-amber-500' : 'bg-red-500'
                      )}
                      style={{ width: `${Math.min((product.stock / 20) * 100, 100)}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-gray-500 text-center block mt-0.5">موجودی: {product.stock}</span>
                </div>
              )}
            </div>

            {/* Action Button */}
            {showActions && !isOutOfStock && (
              <Button
                onClick={handleAddToCart}
                size={isCompact ? 'sm' : 'default'}
                className={cn(
                  'w-full gap-2 transition-all duration-200',
                  'bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary',
                  'shadow-md hover:shadow-lg'
                )}
                disabled={isOutOfStock}
              >
                <>
                  <ShoppingCart className="h-4 w-4" />
                  <span className={isCompact ? 'text-sm' : ''}>{isCompact ? 'افزودن' : 'افزودن به سبد خرید'}</span>
                </>
              </Button>
            )}

            {/* Sold Out Button */}
            {isOutOfStock && (
              <Button
                variant="outline"
                size={isCompact ? 'sm' : 'default'}
                className="w-full cursor-not-allowed opacity-60"
                disabled
              >
                <span>اطلاع‌رسانی هنگام موجودی</span>
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
