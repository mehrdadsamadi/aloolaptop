import { Toaster } from '@/components/ui/sonner'
import { UserProvider } from '@/context/user.context'
import { LoadingProvider } from '@/context/loading.context'
import LoadingOverlay from '@/components/common/loadingOverlay'

export default function Providers({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <LoadingProvider>
      <UserProvider>
        {children}

        <Toaster
          position="bottom-center"
          closeButton
          dir={'rtl'}
        />

        <LoadingOverlay />
      </UserProvider>
    </LoadingProvider>
  )
}
