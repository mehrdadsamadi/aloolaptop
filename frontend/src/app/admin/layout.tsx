import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Sidebar } from '@/components/admin/sidebar/sidebar'
import { DynamicBreadcrumb } from '@/components/admin/dynamicBreadcrumb'
import { BackButton } from '@/components/admin/backButton'

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar side={'right'} />

      <SidebarInset className={'overflow-auto'}>
        <header className="flex h-16 shrink-0 items-center gap-4 border-b px-4">
          <SidebarTrigger className="-mr-1 ml-auto rotate-180" />

          <DynamicBreadcrumb />

          <BackButton />
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 overflow-auto">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
