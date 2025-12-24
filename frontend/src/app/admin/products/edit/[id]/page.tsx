import { getProductById } from '@/actions/product.action'
import EditProduct from '@/app/admin/products/edit/[id]/EditProduct'

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await getProductById(id)

  return <EditProduct product={product} />
}
