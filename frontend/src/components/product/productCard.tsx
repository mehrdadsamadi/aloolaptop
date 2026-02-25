// components/product/product-card.tsx
'use client'

import Link from 'next/link'
import { useState } from 'react'
import { formatPrice, getRemainingTime, showError } from '@/lib/utils'
import { IProduct, ProductCondition } from '@/types/admin/product.type'
import { addToCart } from '@/actions/cart.action'
import { toast } from 'sonner'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Heart, ShoppingCart, Shuffle } from 'lucide-react'

interface ProductCardProps {
  product: IProduct
}

export function ProductCard({ product }: ProductCardProps) {
  console.log('product', product)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const mainImage = product?.images?.[0]
  const hasDiscount = product?.discountPercent > 0 && (!product?.discountExpiresAt || new Date(product?.discountExpiresAt) > new Date())
  const isOutOfStock = product?.stock === 0
  const isLowStock = product?.stock > 0 && product?.stock <= 5

  // تایمر تخفیف
  const discountTimeLeft = product?.discountExpiresAt ? getRemainingTime(new Date(product.discountExpiresAt)) : null

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    try {
      setIsLoading(true)

      const res = await addToCart({ productId: product?._id })

      if (res?.ok === false) {
        showError(res.messages)
        return
      }

      toast.success(res?.message)
    } catch (error) {
      console.error('خطا در اضافه کردن به سبد خرید', error)
      toast.error('خطا در اضافه کردن به سبد خرید')
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsWishlisted(!isWishlisted)
    // API call for wishlist
  }

  return (
    <Link href={`/products/${product?.slug}`}>
      <div
        className={'flex flex-col rounded-[26px] bg-card-bg relative px-4.5 pt-4 pb-8 max-w-59 min-w-59 text-primary-text h-full'}
        style={{
          boxShadow: '0px 2px 6px 2px rgba(0, 0, 0, 0.15); 0px 1px 2px 0px rgba(0, 0, 0, 0.3) !important;',
        }}
      >
        {/* label */}
        <div
          className={`absolute top-0 right-0 ${isOutOfStock ? 'bg-error' : product?.condition === ProductCondition.NEW ? 'bg-success' : 'bg-secondary-text'} rounded-tr-[26px] size-9 rounded-bl-sm font-semibold text-[8px] text-white flex items-center justify-center`}
        >
          {isOutOfStock ? 'ناموجود' : product?.condition === ProductCondition.NEW ? 'آکبند' : 'استوک'}
        </div>

        {/* image */}
        <div className={'size-50 overflow-hidden rounded-[18px] mx-auto'}>
          <Image
            src={mainImage?.url}
            alt={product?.name}
            width={200}
            height={200}
          />
        </div>

        {/* rate */}
        <div className={'flex items-center gap-1 mt-2 mr-auto h-5'}>
          {product?.rate > 0 && (
            <>
              <Image
                src={'/images/star.png'}
                alt={'star'}
                width={14}
                height={14}
              />
              <p className={'text-secondary-text font-normal text-xs pt-1'}>{product?.rate}</p>
            </>
          )}
        </div>

        {/* name */}
        <div className={'flex flex-col gap-2 mt-2'}>
          <p className={'font-bold text-sm'}>{product?.name}</p>

          <p className={'font-normal text-xs text-error h-4'}>{isLowStock && `تنها ${product?.stock} عدد در انبار باقی مانده`}</p>
        </div>

        {/* attrs */}
        <div className={'flex flex-col gap-2 my-4 flex-1'}>
          {product?.attributes?.length > 0 &&
            product?.attributes?.slice(0, 4)?.map((attr) => (
              <div
                key={attr?._id}
                className={'flex items-center justify-between'}
              >
                <p className={'font-normal text-xs text-secondary-text'}>{attr?.label}</p>
                <p className={'font-normal text-xs'}>{attr?.value}</p>
              </div>
            ))}
        </div>

        {/* price */}
        <div className={'flex flex-col'}>
          <div className={'flex items-center gap-1 text-success justify-end'}>
            <p className={'font-bold'}>{formatPrice(product?.finalPrice, false)}</p>
            <p className={'font-normal text-[8px]'}>تومان</p>
          </div>

          <div className={'flex items-center justify-between h-6'}>
            {hasDiscount && (
              <>
                <div className={'bg-error text-white rounded-xl flex items-center justify-center px-2 py-0.5 font-normal text-xs'}>
                  ٪ {formatPrice(product?.discountPercent, false)} - {discountTimeLeft}
                </div>

                <div className={'flex items-center gap-1 text-secondary-text/73 justify-end line-through'}>
                  <p className={'font-bold'}>{formatPrice(product?.price, false)}</p>
                  <p className={'font-normal text-[8px]'}>تومان</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* buttons */}
        <div className={'grid grid-cols-5 gap-1.75 mt-5.75'}>
          <Button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={'col-span-3 bg-success font-normal text-[8px] h-6 rounded-[10px]'}
          >
            افزودن به سبد خرید
            <ShoppingCart className={'size-4'} />
          </Button>
          <Button
            variant={'outline'}
            className={'col-span-1 h-6 rounded-[10px] border-secondary-text text-secondary-text'}
          >
            <Shuffle className={'size-4'} />
          </Button>
          <Button
            variant={'outline'}
            className={'col-span-1 h-6 rounded-[10px] border-secondary-text text-secondary-text'}
          >
            <Heart className={'size-4'} />
          </Button>
        </div>
      </div>
    </Link>
  )
}
