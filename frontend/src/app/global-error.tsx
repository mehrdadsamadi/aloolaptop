'use client'

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold">خطایی رخ داد</h1>
      <p className="text-muted-foreground">{error.message}</p>

      <button
        onClick={reset}
        className="btn"
      >
        تلاش مجدد
      </button>
    </div>
  )
}
