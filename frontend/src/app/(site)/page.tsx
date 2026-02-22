import { getBestSellers, getBiggestDiscounts, getLatestProducts } from '@/actions/product.action'
import { ProductGrid } from '@/components/product/productGrid'
import SubHeader from '@/components/layout/subHeader'
import { ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import LinkButton from '@/components/common/linkButton'

export default async function HomePage() {
  const [discountedProducts, latestProducts, bestSellers] = await Promise.all([
    getBiggestDiscounts(),
    getLatestProducts(),
    getBestSellers({}),
  ])

  return (
    <main className="flex flex-col gap-20">
      <SubHeader />

      {/* Biggest Discounts */}
      <section className="rounded-[38px] bg-input-bg border border-card-border pt-8.75 px-20.25 pb-14.75 flex flex-col gap-9.25 text-primary-text">
        <div className={'flex flex-col gap-5.25'}>
          <p className={'font-bold text-2xl'}>پیشنهاد های ویژه:</p>

          <div className={'flex items-center justify-between'}>
            <div className={'flex items-center gap-4'}>
              <Button
                size={'lg'}
                className={'bg-primary-text rounded-2xl px-9'}
              >
                لپت تاپ ها
              </Button>
              <Button
                size={'lg'}
                variant={'outline'}
                className={'text-primary-text rounded-2xl border-primary-text bg-input-bg px-9'}
              >
                لوازم جانبی
              </Button>
            </div>

            <LinkButton
              href={'/'}
              variant={'ghost'}
            >
              <p className={'font-medium'}>نمایش همه</p>
              <ChevronLeft />
            </LinkButton>
          </div>
        </div>

        <ProductGrid
          products={discountedProducts}
          gridCols="5"
        />
      </section>

      {/* Latest Products */}
      <section className="rounded-[38px] bg-input-bg border border-card-border pt-8.75 px-20.25 pb-14.75 flex flex-col gap-9.25 text-primary-text">
        <div className={'flex flex-col gap-5.25'}>
          <p className={'font-bold text-2xl'}>جدیدترین ها:</p>

          <div className={'flex items-center justify-between'}>
            <div className={'flex items-center gap-4'}>
              <Button
                size={'lg'}
                className={'bg-primary-text rounded-2xl px-9'}
              >
                لپت تاپ ها
              </Button>
              <Button
                size={'lg'}
                variant={'outline'}
                className={'text-primary-text rounded-2xl border-primary-text bg-input-bg px-9'}
              >
                لوازم جانبی
              </Button>
            </div>

            <LinkButton
              href={'/'}
              variant={'ghost'}
            >
              <p className={'font-medium'}>نمایش همه</p>
              <ChevronLeft />
            </LinkButton>
          </div>
        </div>

        <ProductGrid
          products={latestProducts}
          gridCols="5"
        />
      </section>

      {/* Best Sellers */}
      <section className="rounded-[38px] bg-input-bg border border-card-border pt-8.75 px-20.25 pb-14.75 flex flex-col gap-9.25 text-primary-text mb-20">
        <div className={'flex flex-col gap-5.25'}>
          <p className={'font-bold text-2xl'}>پرفروش ترین ها:</p>

          <div className={'flex items-center justify-between'}>
            <div className={'flex items-center gap-4'}>
              <Button
                size={'lg'}
                className={'bg-primary-text rounded-2xl px-9'}
              >
                لپت تاپ ها
              </Button>
              <Button
                size={'lg'}
                variant={'outline'}
                className={'text-primary-text rounded-2xl border-primary-text bg-input-bg px-9'}
              >
                لوازم جانبی
              </Button>
            </div>

            <LinkButton
              href={'/'}
              variant={'ghost'}
            >
              <p className={'font-medium'}>نمایش همه</p>
              <ChevronLeft />
            </LinkButton>
          </div>
        </div>

        <ProductGrid
          products={bestSellers}
          gridCols="5"
        />
      </section>
    </main>
  )
}
