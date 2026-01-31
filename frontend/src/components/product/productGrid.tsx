// components/product/product-grid.tsx
import { Skeleton } from '@/components/ui/skeleton'
import { IProduct } from '@/types/admin/product.type'
import { ProductCard } from '@/components/product/productCard'

interface ProductGridProps {
  products: IProduct[]
  isLoading?: boolean
  itemsPerPage?: number
}

export function ProductGrid({ products, isLoading = false, itemsPerPage = 12 }: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: itemsPerPage }).map((_, i) => (
          <Skeleton
            key={i}
            className="h-[400px] rounded-xl"
          />
        ))}
      </div>
    )
  }

  if (!products?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-gray-400 text-6xl mb-4">📦</div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">محصولی یافت نشد</h3>
        <p className="text-gray-500">هیچ محصولی در این دسته‌بندی موجود نیست</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product?._id}
          product={product}
        />
      ))}
    </div>
  )
}
