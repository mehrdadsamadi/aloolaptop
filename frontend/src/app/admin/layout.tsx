import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Sidebar } from '@/components/admin/sidebar/sidebar'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { cookies } from 'next/headers'
import { jwtDecode } from 'jwt-decode'
import { JwtPayload } from '@/lib/jwtCoockie'
import { Roles } from '@/lib/enums/roles.enum'
import { redirect } from 'next/navigation'

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()

  const payload = jwtDecode<JwtPayload>(cookieStore.get('access_token')?.value ?? '')

  if (payload.role !== Roles.ADMIN) redirect('/403')

  return (
    <SidebarProvider>
      <Sidebar side={'right'} />

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-4 border-b px-4">
          <SidebarTrigger className="-mr-1 ml-auto rotate-180" />
          <Breadcrumb className={'flex-1'}>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/admin">داشبورد</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block rotate-180" />
              <BreadcrumbItem>
                <BreadcrumbPage>کاربران</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
