import { Toaster } from '@/components/ui/sonner'
import { UserProvider } from '@/context/user.context'
import { LoadingProvider } from '@/context/loading.context'
import LoadingOverlay from '@/components/common/loadingOverlay'
import { ConfirmDialogProvider } from '@/context/confirmDialog.context'
import { DirectionProvider } from '@/components/ui/direction'

export default function Providers({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <DirectionProvider dir="rtl">
      <LoadingProvider>
        <ConfirmDialogProvider>
          <UserProvider>
            {children}

            <Toaster
              position="bottom-center"
              closeButton
              dir={'rtl'}
            />

            <LoadingOverlay />
          </UserProvider>
        </ConfirmDialogProvider>
      </LoadingProvider>
    </DirectionProvider>
  )
}
