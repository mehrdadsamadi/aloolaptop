// components/product/product-card.tsx
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Eye, Heart, ShoppingCart, Zap } from 'lucide-react'
import { cn, formatPrice } from '@/lib/utils'
import { IProduct } from '@/types/admin/product.type'
import { RatingStars } from '@/components/common/ratingStart'
import { IconButton } from '@/components/common/iconButton'

interface ProductCardProps {
  product: IProduct
  className?: string
  showActions?: boolean
}

export function ProductCard({ product, className, showActions = true }: ProductCardProps) {
  const mainImage = product?.images[0]
  const hasDiscount = product?.discountPercent > 0 && (!product?.discountExpiresAt || new Date(product?.discountExpiresAt) > new Date())
  const isOutOfStock = product?.stock === 0

  return (
    <Card
      className={cn(
        'group relative overflow-hidden transition-all duration-300 hover:shadow-xl',
        'border-gray-200 dark:border-gray-800',
        isOutOfStock && 'opacity-60',
        className
      )}
    >
      {/* Discount Badge */}
      {hasDiscount && <Badge className="absolute left-3 top-3 z-10 bg-red-500 hover:bg-red-600">{product?.discountPercent}% OFF</Badge>}

      {/* Condition Badge */}
      <Badge
        variant="secondary"
        className="absolute right-3 top-3 z-10 capitalize"
      >
        {product?.condition}
      </Badge>

      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-900">
        {mainImage ? (
          <Image
            src={mainImage?.url}
            alt={product?.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Zap className="h-12 w-12 text-gray-400" />
          </div>
        )}

        {/* Quick Actions Overlay */}
        {showActions && (
          <div
            className="absolute inset-0 flex items-center justify-center gap-2
                         bg-black/40 opacity-0 transition-opacity duration-300
                         group-hover:opacity-100"
          >
            <IconButton
              variant="secondary"
              size="lg"
              className="bg-white hover:bg-gray-100"
            >
              <Eye className="h-5 w-5" />
            </IconButton>
            <IconButton
              variant="secondary"
              size="lg"
              className="bg-white hover:bg-gray-100"
            >
              <Heart className="h-5 w-5" />
            </IconButton>
          </div>
        )}

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <Badge
              variant="destructive"
              className="px-4 py-2 text-lg"
            >
              ناموجود
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        {/* Product Info */}
        <div className="space-y-2">
          {/* Category - Optional */}
          <Badge
            variant="outline"
            className="text-xs"
          >
            {product?.categoryId?.name}
          </Badge>

          {/* Product Name */}
          <Link href={`/products/${product?.slug}`}>
            <h3
              className="line-clamp-1 font-semibold text-gray-900
                         dark:text-gray-100 transition-colors
                         hover:text-primary"
            >
              {product?.name}
            </h3>
          </Link>

          {/* Description */}
          {product?.description && <p className="line-clamp-2 text-sm text-gray-600 dark:text-gray-400">{product?.description}</p>}

          {/* Rating */}
          <div className="flex items-center gap-2">
            <RatingStars
              rating={product?.rate}
              size="sm"
            />
            <span className="text-sm text-gray-500">({product?.rate?.toFixed(1)})</span>
          </div>

          {/* Grade */}
          {product?.grade && (
            <Badge
              variant="outline"
              className="text-xs"
            >
              Grade: {product?.grade}
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-3 p-4 pt-0">
        {/* Price Section */}
        <div className="flex items-center justify-between w-full">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">{formatPrice(product?.finalPrice)}</span>

            {hasDiscount && <span className="text-sm text-gray-500 line-through">{formatPrice(product?.price)}</span>}
          </div>

          {/* Stock Indicator */}
          {product?.stock > 0 && product?.stock < 10 && (
            <Badge
              variant="outline"
              className="text-xs text-amber-600"
            >
              فقط {product?.stock} عدد باقی مانده
            </Badge>
          )}
        </div>

        {/* Action Buttons */}
        {showActions && !isOutOfStock && (
          <div className="flex w-full gap-2">
            <Button
              className="flex-1 gap-2"
              disabled={isOutOfStock}
            >
              <ShoppingCart className="h-4 w-4" />
              افزودن به سبد
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
