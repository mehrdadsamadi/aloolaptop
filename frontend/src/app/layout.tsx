import type { Metadata } from 'next'
import './globals.css'
import localFont from 'next/font/local'
import Providers from '@/app/providers'

const vazir = localFont({
  src: [
    {
      path: '../fonts/Vazirmatn-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../fonts/Vazirmatn-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../fonts/Vazirmatn-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-vazirmatn',
})

export const metadata: Metadata = {
  title: 'الو لپتاپ',
  description: 'خرید لپتاپ های دسته دوم و نو',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="fa"
      dir="rtl"
    >
      <head>
        <title>{metadata.title?.toString()}</title>

        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link
          rel="manifest"
          href="/site.webmanifest"
        />
      </head>

      <body className={`${vazir.variable} antialiased overflow-x-hidden`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
