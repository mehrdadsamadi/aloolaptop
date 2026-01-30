'use client'

import { Button } from '@/components/ui/button'
import { getMe } from '@/actions/user.action'
import { useUser } from '@/hooks/useUser'
import ButtonLink from '@/components/common/ButtonLink'
import { toast } from 'sonner'

export default function Home() {
  const { logout } = useUser()
  const getUser = async () => {
    const res = await getMe()
    console.log(res)
  }

  const handleLogout = () => {
    logout()

    toast.success('شما با موفقیت خارج شدید.')
  }
  return (
    <section className={'min-w-screen min-h-screen flex flex-col gap-4 items-center justify-center'}>
      <ButtonLink href={'/auth'}>ورود</ButtonLink>
      <ButtonLink href={'/admin'}>ادمین</ButtonLink>
      {/*<Button onClick={getUser}>hello mehrdad</Button>*/}
      <Button onClick={handleLogout}>خروج</Button>
    </section>
  )
}
