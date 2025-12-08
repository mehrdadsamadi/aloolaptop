'use server'

export async function sendOtp(mobile: string) {
  try {
    const res = await fetch(`${process.env.API_URL}/auth/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobile }),
      cache: 'no-store',
    })

    const data = await res.json()

    if (!res?.ok) {
      // خطای API
      return {
        success: false,
        error: data.messages[0].message || 'خطایی رخ داد',
      }
    }

    return {
      success: true,
      data,
    }
  } catch (error) {
    console.log('error', error)
    // خطای شبکه
    return {
      success: false,
      error: 'اتصال به سرور برقرار نشد',
    }
  }
}

export async function checkOtp({ mobile, code }: { mobile: string; code: string }) {
  try {
    const res = await fetch(`${process.env.API_URL}/auth/check-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobile, code }),
      cache: 'no-store',
    })

    const data = await res.json()

    if (!res?.ok) {
      return {
        success: false,
        error: data.messages[0].message || 'کد تایید اشتباه است',
      }
    }

    return {
      success: true,
      data,
    }
  } catch (error) {
    console.log('error', error)

    return {
      success: false,
      error: 'اتصال به سرور برقرار نشد',
    }
  }
}
