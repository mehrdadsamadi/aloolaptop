import CheckoutCallback from '@/app/(site)/checkout/callback/CheckoutCallback'
import { SearchParams } from '@/types/params.type'
import { verifyCheckout } from '@/actions/checkout.action'

export type CallbackPaymentStatus = 'OK' | 'NOK'

export default async function CheckoutCallbackPage({
  searchParams,
}: {
  searchParams: SearchParams<{ Authority: string; Status: CallbackPaymentStatus }>
}) {
  const { Authority, Status } = await searchParams

  const res = await verifyCheckout(Authority, Status)

  return <CheckoutCallback {...res} />
}
