// components/product/product-grid.tsx
import { Skeleton } from '@/components/ui/skeleton'
import { IProduct } from '@/types/admin/product.type'
import { ProductCard } from '@/components/product/productCard'

interface ProductGridProps {
  products: IProduct[]
  isLoading?: boolean
  itemsPerPage?: number
  gridCols?: '2' | '3' | '4' | '5' // تعداد ستون‌های گرید
  variant?: 'default' | 'compact' // حالت نمایش
}

export function ProductGrid({ products, isLoading = false, itemsPerPage = 12, gridCols = '4', variant = 'default' }: ProductGridProps) {
  // کلاس‌های responsive بر اساس تعداد ستون‌ها
  const gridColsClasses = {
    '2': 'grid-cols-1 sm:grid-cols-2',
    '3': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    '4': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    '5': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5',
  }

  if (isLoading) {
    return (
      <div className={`grid ${gridColsClasses[gridCols]} gap-4 md:gap-6`}>
        {Array.from({ length: itemsPerPage }).map((_, i) => (
          <Skeleton
            key={i}
            className="h-75 md:h-87.5 rounded-lg md:rounded-xl"
          />
        ))}
      </div>
    )
  }

  if (!products?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 md:py-20 text-center">
        <div className="text-gray-300 dark:text-gray-600 text-5xl md:text-6xl mb-3 md:mb-4">📦</div>
        <h3 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-200 mb-1 md:mb-2">محصولی یافت نشد</h3>
        <p className="text-sm md:text-base text-gray-500 dark:text-gray-400">هیچ محصولی در این دسته‌بندی موجود نیست</p>
      </div>
    )
  }

  return (
    <div className={`grid ${gridColsClasses[gridCols]} gap-4 md:gap-6`}>
      {products.map((product) => (
        <ProductCard
          key={product?._id}
          product={product}
        />
      ))}
    </div>
  )
}
