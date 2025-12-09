import AuthForm from '@/app/(site)/auth/AuthForm'

export default async function LoginPage() {
  // const token = (await cookies()).get('access_token')?.value
  //
  // if (token) redirect('/')

  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <AuthForm />
      </div>
    </div>
  )
}
