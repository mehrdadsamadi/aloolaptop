// app/products/products-client.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { IProduct } from '@/types/admin/product.type'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Search, Filter, X, Grid3x3, LayoutList, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ProductCard } from '@/components/product/productCard'
import { getProductsList } from '@/actions/product.action'

interface Filters {
  search: string
  category: string
  condition: string[]
  grade: string[]
  minPrice: number
  maxPrice: number
  sortBy: string
}

interface Category {
  _id: string
  name: string
  slug: string
}

interface ProductsClientProps {
  initialFilters: {
    search: string
    category: string
    condition: string
    grade: string
    minPrice: number
    maxPrice: number
    sortBy: string
  }
}

export default function ProductsClient({ initialFilters }: ProductsClientProps) {
  const router = useRouter()

  const [products, setProducts] = useState<IProduct[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const [filters, setFilters] = useState<Filters>({
    search: initialFilters.search || '',
    category: initialFilters.category || '',
    condition: initialFilters.condition?.split(',') || [],
    grade: initialFilters.grade?.split(',') || [],
    minPrice: initialFilters.minPrice || 0,
    maxPrice: initialFilters.maxPrice || 10000000,
    sortBy: initialFilters.sortBy || 'newest',
  })

  const [priceRange, setPriceRange] = useState([filters.minPrice, filters.maxPrice])
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pagesCount: 1,
    hasMore: true,
  })

  // گزینه‌های مرتب‌سازی
  const sortOptions = [
    { value: 'newest', label: 'جدیدترین' },
    { value: 'price_asc', label: 'ارزان‌ترین' },
    { value: 'price_desc', label: 'گران‌ترین' },
    { value: 'bestseller', label: 'پرفروش‌ترین' },
    { value: 'most_viewed', label: 'پربازدیدترین' },
  ]

  // گزینه‌های شرایط محصول
  const conditionOptions = [
    { value: 'new', label: 'نو (آکبند)' },
    { value: 'used', label: 'استوک' },
  ]

  // گزینه‌های گرید
  const gradeOptions = [
    { value: 'A', label: 'A' },
    { value: 'A+', label: 'A+' },
    { value: 'A++', label: 'A++' },
    { value: 'A+++', label: 'A+++' },
  ]

  // بارگذاری دسته‌بندی‌ها
  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories')
      const data = await res.json()
      setCategories(data.categories || [])
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  // بارگذاری محصولات
  const fetchProducts = async (pageNum: number, reset = false) => {
    try {
      if (reset) {
        setLoading(true)
      } else {
        setLoadingMore(true)
      }

      const queryParams = new URLSearchParams({
        page: pageNum.toString(),
        limit: pagination.limit.toString(),
        ...(filters.search && { search: filters.search }),
        ...(filters.category && { categoryId: filters.category }),
        ...(filters.condition.length && { condition: filters.condition.join(',') }),
        ...(filters.grade.length && { grade: filters.grade.join(',') }),
        ...(filters.minPrice && { minPrice: filters.minPrice.toString() }),
        ...(filters.maxPrice && { maxPrice: filters.maxPrice.toString() }),
        sortBy: filters.sortBy,
      })

      const res = await getProductsList(queryParams.toString())

      if (res?.ok === false) {
        console.error(res.messages)
        return
      }

      if (reset) {
        setProducts(res?.products || [])
      } else {
        setProducts((prev) => [...prev, ...(res?.products || [])])
      }

      setPagination({
        page: res?.pagination?.page || pageNum,
        limit: pagination.limit,
        total: res?.pagination?.total || 0,
        pagesCount: res?.pagination?.pagesCount || 1,
        hasMore: (res?.pagination?.page || pageNum) < (res?.pagination?.pagesCount || 1),
      })
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  // آپدیت URL با فیلترها
  const updateURL = useCallback(() => {
    const params = new URLSearchParams()

    if (filters.search) params.set('search', filters.search)
    if (filters.category) params.set('category', filters.category)
    if (filters.condition.length) params.set('condition', filters.condition.join(','))
    if (filters.grade.length) params.set('grade', filters.grade.join(','))
    if (filters.minPrice) params.set('minPrice', filters.minPrice.toString())
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice.toString())
    if (filters.sortBy !== 'newest') params.set('sortBy', filters.sortBy)

    const newURL = params.toString() ? `?${params.toString()}` : window.location.pathname
    router.push(newURL, { scroll: false })
  }, [filters, router])

  // اعمال فیلترها
  const applyFilters = () => {
    setFilters((prev) => ({
      ...prev,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
    }))
    setPagination((prev) => ({ ...prev, page: 1, hasMore: true }))
    setIsFilterOpen(false)
  }

  // ریست فیلترها
  const resetFilters = () => {
    setFilters({
      search: '',
      category: '',
      condition: [],
      grade: [],
      minPrice: 0,
      maxPrice: 10000000,
      sortBy: 'newest',
    })
    setPriceRange([0, 10000000])
    setPagination((prev) => ({ ...prev, page: 1, hasMore: true }))
  }

  // حذف یک فیلتر خاص
  const removeFilter = (key: keyof Filters, value?: string) => {
    if (key === 'condition' && value) {
      setFilters((prev) => ({
        ...prev,
        condition: prev.condition.filter((c) => c !== value),
      }))
    } else if (key === 'grade' && value) {
      setFilters((prev) => ({
        ...prev,
        grade: prev.grade.filter((g) => g !== value),
      }))
    } else if (key === 'category') {
      setFilters((prev) => ({ ...prev, category: '' }))
    } else if (key === 'search') {
      setFilters((prev) => ({ ...prev, search: '' }))
    }
    setPagination((prev) => ({ ...prev, page: 1, hasMore: true }))
  }

  // بارگذاری اولیه
  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    fetchProducts(1, true)
  }, [filters])

  // بارگذاری صفحات بیشتر (اسکرول بینهایت)
  const loadMore = () => {
    if (!loadingMore && pagination.hasMore && !loading) {
      const nextPage = pagination.page + 1
      fetchProducts(nextPage, false)
    }
  }

  // تعداد فیلترهای فعال
  const activeFiltersCount = [
    filters.search,
    filters.category,
    ...filters.condition,
    ...filters.grade,
    filters.minPrice > 0 || filters.maxPrice < 10000000,
  ].filter(Boolean).length

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">محصولات</h1>
          <p className="text-muted-foreground">{pagination.total > 0 ? `${pagination.total} محصول یافت شد` : 'محصولی یافت نشد'}</p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="جستجوی محصولات..."
                value={filters.search}
                onChange={(e) => {
                  setFilters((prev) => ({ ...prev, search: e.target.value }))
                  setPagination((prev) => ({ ...prev, page: 1, hasMore: true }))
                }}
                className="pr-10"
              />
            </div>

            {/* Sort Select */}
            <div className="w-full md:w-64">
              <Select
                value={filters.sortBy}
                onValueChange={(value) => {
                  setFilters((prev) => ({ ...prev, sortBy: value }))
                  setPagination((prev) => ({ ...prev, page: 1, hasMore: true }))
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="مرتب‌سازی" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Filter Button (Mobile) */}
            <Sheet
              open={isFilterOpen}
              onOpenChange={setIsFilterOpen}
            >
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  className="relative md:hidden"
                >
                  <Filter className="h-4 w-4 ml-2" />
                  فیلترها
                  {activeFiltersCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center"
                    >
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-full sm:w-[400px] overflow-y-auto"
              >
                <FilterSidebar
                  categories={categories}
                  filters={filters}
                  priceRange={priceRange}
                  setPriceRange={setPriceRange}
                  conditionOptions={conditionOptions}
                  gradeOptions={gradeOptions}
                  onApply={applyFilters}
                  onReset={resetFilters}
                />
              </SheetContent>
            </Sheet>

            {/* View Toggle */}
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('grid')}
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('list')}
              >
                <LayoutList className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Active Filters */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
              {filters.search && (
                <Badge
                  variant="secondary"
                  className="gap-1"
                >
                  جستجو: {filters.search}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => removeFilter('search')}
                  />
                </Badge>
              )}
              {filters.category && categories.find((c) => c._id === filters.category) && (
                <Badge
                  variant="secondary"
                  className="gap-1"
                >
                  دسته: {categories.find((c) => c._id === filters.category)?.name}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => removeFilter('category')}
                  />
                </Badge>
              )}
              {filters.condition.map((cond) => (
                <Badge
                  key={cond}
                  variant="secondary"
                  className="gap-1"
                >
                  {cond === 'new' ? 'نو' : 'استوک'}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => removeFilter('condition', cond)}
                  />
                </Badge>
              ))}
              {filters.grade.map((grade) => (
                <Badge
                  key={grade}
                  variant="secondary"
                  className="gap-1"
                >
                  گرید {grade}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => removeFilter('grade', grade)}
                  />
                </Badge>
              ))}
              {(filters.minPrice > 0 || filters.maxPrice < 10000000) && (
                <Badge
                  variant="secondary"
                  className="gap-1"
                >
                  قیمت: {filters.minPrice.toLocaleString()} - {filters.maxPrice.toLocaleString()} تومان
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => {
                      setFilters((prev) => ({ ...prev, minPrice: 0, maxPrice: 10000000 }))
                      setPriceRange([0, 10000000])
                    }}
                  />
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="text-primary"
              >
                حذف همه
              </Button>
            </div>
          )}
        </div>

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden md:block w-80 shrink-0">
            <div className="sticky top-24 bg-white rounded-xl shadow-sm p-6">
              <FilterSidebar
                categories={categories}
                filters={filters}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                conditionOptions={conditionOptions}
                gradeOptions={gradeOptions}
                onApply={applyFilters}
                onReset={resetFilters}
              />
            </div>
          </div>

          {/* Products Grid/List */}
          <div className="flex-1">
            {loading && products.length === 0 ? (
              <div className={cn('grid gap-6', viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1')}>
                {[...Array(6)].map((_, i) => (
                  <Skeleton
                    key={i}
                    className="h-96 rounded-xl"
                  />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">محصولی یافت نشد</h3>
                <p className="text-muted-foreground">لطفاً فیلترهای دیگری را امتحان کنید</p>
                <Button
                  onClick={resetFilters}
                  className="mt-4"
                >
                  حذف فیلترها
                </Button>
              </div>
            ) : (
              <>
                <div className={cn('grid gap-6', viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1')}>
                  {products.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                    />
                  ))}
                </div>

                {/* Load More Button */}
                {pagination.hasMore && (
                  <div className="text-center mt-8">
                    <Button
                      variant="outline"
                      onClick={loadMore}
                      disabled={loadingMore}
                      className="gap-2"
                    >
                      {loadingMore && <Loader2 className="h-4 w-4 animate-spin" />}
                      {loadingMore ? 'در حال بارگذاری...' : 'بارگذاری بیشتر'}
                    </Button>
                  </div>
                )}

                {/* Pagination Info */}
                {!pagination.hasMore && products.length > 0 && (
                  <div className="text-center mt-8 text-sm text-muted-foreground">
                    {products.length} از {pagination.total} محصول نمایش داده شد
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// کامپوننت سایدبار فیلترها
interface FilterSidebarProps {
  categories: Category[]
  filters: Filters
  priceRange: number[]
  setPriceRange: (value: number[]) => void
  conditionOptions: { value: string; label: string }[]
  gradeOptions: { value: string; label: string }[]
  onApply: () => void
  onReset: () => void
}

function FilterSidebar({
  categories,
  filters,
  priceRange,
  setPriceRange,
  conditionOptions,
  gradeOptions,
  onApply,
  onReset,
}: FilterSidebarProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">فیلترها</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
        >
          حذف همه
        </Button>
      </div>

      <Separator />

      <Accordion
        type="single"
        collapsible
        defaultValue="categories"
      >
        {/* دسته‌بندی */}
        <AccordionItem value="categories">
          <AccordionTrigger className="text-base">دسته‌بندی</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {categories.map((category) => (
                <div
                  key={category._id}
                  className="flex items-center"
                >
                  <Checkbox
                    id={`category-${category._id}`}
                    checked={filters.category === category._id}
                    onCheckedChange={() => {
                      if (filters.category === category._id) {
                        // حذف فیلتر
                        const newFilters = { ...filters, categoryId: '' }
                        // اینجا باید فیلترها آپدیت شوند
                      } else {
                        // اعمال فیلتر
                        const newFilters = { ...filters, categoryId: category._id }
                        // اینجا باید فیلترها آپدیت شوند
                      }
                    }}
                  />
                  <Label
                    htmlFor={`category-${category._id}`}
                    className="mr-2 cursor-pointer"
                  >
                    {category.name}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* محدوده قیمت */}
        <AccordionItem value="price">
          <AccordionTrigger className="text-base">محدوده قیمت</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <Slider
                value={priceRange}
                min={0}
                max={10000000}
                step={100000}
                onValueChange={setPriceRange}
                className="my-6"
              />
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <Label className="text-xs">از</Label>
                  <Input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                    className="mt-1"
                  />
                </div>
                <div className="flex-1">
                  <Label className="text-xs">تا</Label>
                  <Input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* شرایط محصول */}
        <AccordionItem value="condition">
          <AccordionTrigger className="text-base">شرایط محصول</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {conditionOptions.map((option) => (
                <div
                  key={option.value}
                  className="flex items-center"
                >
                  <Checkbox
                    id={`condition-${option.value}`}
                    checked={filters.condition.includes(option.value)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        filters.condition.push(option.value)
                      } else {
                        const index = filters.condition.indexOf(option.value)
                        if (index > -1) filters.condition.splice(index, 1)
                      }
                    }}
                  />
                  <Label
                    htmlFor={`condition-${option.value}`}
                    className="mr-2 cursor-pointer"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* گرید محصول */}
        <AccordionItem value="grade">
          <AccordionTrigger className="text-base">گرید محصول</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {gradeOptions.map((option) => (
                <div
                  key={option.value}
                  className="flex items-center"
                >
                  <Checkbox
                    id={`grade-${option.value}`}
                    checked={filters.grade.includes(option.value)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        filters.grade.push(option.value)
                      } else {
                        const index = filters.grade.indexOf(option.value)
                        if (index > -1) filters.grade.splice(index, 1)
                      }
                    }}
                  />
                  <Label
                    htmlFor={`grade-${option.value}`}
                    className="mr-2 cursor-pointer"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Separator />

      <div className="flex gap-3">
        <Button
          onClick={onApply}
          className="flex-1"
        >
          اعمال فیلترها
        </Button>
        <Button
          variant="outline"
          onClick={onReset}
        >
          ریست
        </Button>
      </div>
    </div>
  )
}
