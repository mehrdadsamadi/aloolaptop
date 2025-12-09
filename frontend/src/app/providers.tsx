import { Toaster } from '@/components/ui/sonner'
import { UserProvider } from '@/context/user.context'

export default function Providers({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <UserProvider>
      {children}

      <Toaster
        position="bottom-center"
        closeButton
        dir={'rtl'}
      />
    </UserProvider>
  )
}
