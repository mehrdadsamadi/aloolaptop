import { Toaster } from '@/components/ui/sonner'

export default function Providers({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      {children}
      <Toaster
        position="bottom-center"
        closeButton
      />
    </>
  )
}
