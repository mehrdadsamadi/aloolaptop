// app/(site)/dashboard/layout.tsx
'use client'

import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { UserSidebar } from '@/components/user/sidebar/sidebar'
import { DynamicBreadcrumb } from '@/components/admin/dynamicBreadcrumb'
import { BackButton } from '@/components/admin/backButton'

export default function UserDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <UserSidebar side="right" />

      <SidebarInset className={'overflow-auto'}>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-mr-1 ml-auto rotate-180" />

          <DynamicBreadcrumb />

          <BackButton />
        </header>

        <main className={'p-4 overflow-auto'}>{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
