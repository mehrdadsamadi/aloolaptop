import { getBestSellers, getBiggestDiscounts, getLatestProducts } from '@/actions/product.action'
import { ProductGrid } from '@/components/product/productGrid'
import { SectionHeader } from '@/components/product/sectionHeader'

export default async function HomePage() {
  const [latestProducts, bestSellers, discountedProducts] = await Promise.all([
    getBiggestDiscounts(),
    getLatestProducts(),
    getBestSellers({}),
  ])

  return (
    <main className="">
      {/* Hero Section */}
      {/*<HeroSection />*/}

      {/* Biggest Discounts */}
      <section className="container py-8 md:py-12">
        <SectionHeader
          title="تخفیف‌های شگفت‌انگیز"
          subtitle="فرصت طلایی برای خرید با قیمت استثنایی"
          viewAllLink="/products?discount=true"
          viewAllText="مشاهده همه تخفیف‌ها"
        />
        <ProductGrid
          products={discountedProducts}
          gridCols="5" // نمایش ۵ محصول در ردیف
          variant="compact" // حالت فشرده برای نمایش بیشتر
        />
      </section>

      {/* Latest Products */}
      <section className="container py-8 md:py-12">
        <SectionHeader
          title="جدیدترین محصولات"
          subtitle="تازه‌های فروشگاه ما را کشف کنید"
          viewAllLink="/products?sort=newest"
          viewAllText="مشاهده همه جدیدترین‌ها"
        />
        <ProductGrid
          products={latestProducts}
          gridCols="4"
        />
      </section>

      {/* Best Sellers */}
      <section className="container py-8 md:py-12 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-2xl my-8">
        <div className="px-4">
          <SectionHeader
            title="پرفروش‌ترین‌ها"
            subtitle="محصولات محبوب خریداران"
            viewAllLink="/products?sort=best-selling"
            viewAllText="مشاهده همه پرفروش‌ها"
          />
          <ProductGrid
            products={bestSellers}
            gridCols="4"
            variant="default"
          />
        </div>
      </section>

      {/* Categories */}
      {/*<section className="bg-gray-50 dark:bg-gray-900 py-16">*/}
      {/*  <div className="container">*/}
      {/*    <div className="mb-12 text-center">*/}
      {/*      <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">دسته‌بندی‌ها</h2>*/}
      {/*      <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">محصولات را بر اساس دسته‌بندی کشف کنید</p>*/}
      {/*    </div>*/}
      {/*    <CategoryGrid />*/}
      {/*  </div>*/}
      {/*</section>*/}

      {/* Promo Banner */}
      {/*<PromoBanner*/}
      {/*  title="تخفیف‌های ویژه"*/}
      {/*  description="تا ۵۰٪ تخفیف روی محصولات منتخب"*/}
      {/*  imageUrl="/promo-banner.jpg"*/}
      {/*/>*/}

      {/* Testimonials */}
      {/*<section className="container py-16">*/}
      {/*  <Testimonials />*/}
      {/*</section>*/}
    </main>
  )
}
