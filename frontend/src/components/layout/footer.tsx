import Logo from '@/components/common/logo'
import Link from 'next/link'
import { InstagramIcon, Mail, Phone, Send } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className={'px-36 pt-10 pb-20 bg-input-bg grid grid-cols-4 gap-20 border-t-2 border-card-border text-primary-text'}>
      <div className={'flex flex-col gap-2'}>
        <Logo />
        <p className={'font-medium'}>
          فروشگاه الو لپ تاپ مرجع تخصصی ارائه انواع لپ‌تاپ‌های آکبند و استوک، قطعات سیستم و خدمات تعمیرات است. ما با هدف ارائه بهترین کیفیت
          و خدمات پس از فروش، همراه شما در انتخاب هوشمندانه هستیم
        </p>
      </div>

      <div className={'flex flex-col gap-2'}>
        <p className={'font-bold text-2xl'}>لینک های مفید</p>
        <ul className={'flex flex-col gap-2 font-medium'}>
          <li>
            <Link href={'/'}>لپ تاپ آکبند</Link>
          </li>
          <li>
            <Link href={'/'}>لپ تاپ استوک</Link>
          </li>
          <li>
            <Link href={'/'}>سوالات متداول</Link>
          </li>
        </ul>
      </div>

      <div className={'flex flex-col gap-4'}>
        <div className={'flex flex-col gap-2'}>
          <p className={'font-bold text-2xl'}>راه های ارتباطی</p>
          <ul className={'flex flex-col gap-2 font-medium'}>
            <li className={'flex items-center gap-1'}>
              <Phone className={'size-5'} />
              <a
                href={'tel:+989039098494'}
                className={'pt-1'}
              >
                09039098494
              </a>
            </li>
            <li className={'flex items-center gap-1'}>
              <Mail className={'size-5'} />
              <a
                href={'mailto:info@aloolaptop.ir'}
                className={'pt-1'}
              >
                info@aloolaptop.ir
              </a>
            </li>
          </ul>
        </div>

        <div className={'flex flex-col gap-2'}>
          <p className={'font-semibold text-xl'}>شبکه های اجتماعی</p>
          <div className={'flex items-center gap-3'}>
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href="https://t.me/aloolaptop"
                  target="_blank"
                  rel="noopener"
                >
                  <Send />
                </a>
              </TooltipTrigger>
              <TooltipContent>
                <p>تلگرام</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href="https://instagram.com/aloolaptop"
                  target="_blank"
                  rel="noopener"
                >
                  <InstagramIcon />
                </a>
              </TooltipTrigger>
              <TooltipContent>
                <p>اینستاگرام</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>

      <div className={'flex flex-col gap-2'}>
        <p className={'font-bold text-2xl'}>نماد اعتماد</p>
        <Image
          src={'/images/enamad.png'}
          alt={'enamad'}
          width={94}
          height={500}
        />
      </div>
    </footer>
  )
}
