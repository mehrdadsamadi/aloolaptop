// components/product/product-carousel.tsx
'use client'

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { IProduct } from '@/types/admin/product.type'
import ProductCardSkeleton from '@/components/product/productCardSkeleton'
import { ProductCard } from '@/components/product/productCard'

interface ProductCarouselProps {
  products: IProduct[]
  isLoading?: boolean
  slidesPerView?: number
}

export function ProductCarousel({ products, isLoading = false, slidesPerView = 4 }: ProductCarouselProps) {
  // تنظیمات breakpoints برای نمایش در سایزهای مختلف
  const breakpoints = {
    320: { slides: 1, gap: 10 },
    480: { slides: 2, gap: 15 },
    768: { slides: 2, gap: 15 },
    1024: { slides: 3, gap: 20 },
    1280: { slides: slidesPerView, gap: 20 },
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: slidesPerView }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  if (!products?.length) {
    return null
  }

  return (
    <div className="space-y-4">
      {/* کروسل اصلی */}
      <Carousel
        opts={{
          align: 'start',
          loop: true,
          direction: 'rtl', // برای فارسی
          breakpoints: {
            320: { slidesToScroll: 1 },
            768: { slidesToScroll: 2 },
            1024: { slidesToScroll: 3 },
          },
        }}
        className="relative"
      >
        <CarouselContent>
          {products.map((product) => (
            <CarouselItem
              key={product._id}
              className="basis-full sm:basis-1/2 md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
            >
              <ProductCard product={product} />
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* دکمه‌های ناوبری */}
        <CarouselPrevious className="hidden lg:flex -right-4 rotate-180" />
        <CarouselNext className="hidden lg:flex -left-4 rotate-180" />
      </Carousel>
    </div>
  )
}
