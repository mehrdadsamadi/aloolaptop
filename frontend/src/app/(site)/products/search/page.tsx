// app/products/page.tsx
import { Metadata } from 'next'
import ProductsClient from './ProductsClient'
import { SearchParams } from '@/types/params.type'
import { ProductCondition, ProductGrade } from '@/types/admin/product.type'

export const metadata: Metadata = {
  title: 'محصولات',
  description: 'مشاهده و خرید انواع محصولات با بهترین قیمت',
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams<{
    search: string
    category: string
    condition: string
    grade: string
    minPrice: string
    maxPrice: string
    sortBy: string
  }>
}) {
  const { search, category, condition, grade, minPrice, maxPrice, sortBy = 'newest' } = await searchParams

  console.log({ search, category, condition, grade, minPrice, maxPrice, sortBy });
  

  return (
    <ProductsClient
      initialFilters={{ search, category, condition, grade, minPrice: Number(minPrice), maxPrice: Number(maxPrice), sortBy }}
    />
  )
}
