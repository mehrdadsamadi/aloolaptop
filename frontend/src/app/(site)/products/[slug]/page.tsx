import { Params } from '@/types/params.type'
import ProductDetailsClient from './ProductDetailsClient'
import { getProductBySlug } from '@/actions/product.action'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'

interface ProductPageProps {
  params: Params<{ slug: string }>
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) {
    return {
      title: 'محصول یافت نشد',
    }
  }

  return {
    title: product.name,
    description: product.description.slice(0, 160),
    openGraph: {
      title: product.name,
      description: product.description.slice(0, 160),
      images: [product.images[0]?.url],
    },
  }
}


export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params

  const product = await getProductBySlug(slug)

  if(!product) {
    notFound()
  }

  return (
    <>
      <ProductDetailsClient product={product} />
    </>
  )
}
