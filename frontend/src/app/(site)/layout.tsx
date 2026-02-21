import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className={'min-h-screen overflow-x-hidden'}>
      <Header />

      <div className="overflow-y-auto px-35.75">{children}</div>

      <Footer />
    </section>
  )
}
