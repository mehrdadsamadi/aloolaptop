export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className={'min-h-screen overflow-x-hidden'}>
      <div className="overflow-y-auto px-24">{children}</div>
    </section>
  )
}
