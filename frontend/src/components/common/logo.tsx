import Image from 'next/image'
import Link from 'next/link'

export default function Logo() {
  return (
    <Link
      href={'/'}
      className={'flex items-center cursor-pointer'}
    >
      <Image
        src="/images/logo-dark.png"
        alt="logo"
        width={54}
        height={500}
      />
      <p className={'font-bold text-2xl pt-1'}>الو لپ تاپ</p>
    </Link>
  )
}
