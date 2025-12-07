"use server";

export async function sendOtp(mobile: string) {
  try {
    const res = await fetch(`${process.env.API_URL}/auth/send-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mobile }),
      cache: "no-store",
    });

    const data = await res.json();

    return data;
  } catch (error) {
    console.log("error", error);
  }
}

export async function checkOtp({
  mobile,
  code,
}: {
  mobile: string;
  code: string;
}) {
  try {
    const res = await fetch(`${process.env.API_URL}/auth/check-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mobile, code }),
      cache: "no-store",
    });

    const data = await res.json();

    return data;
  } catch (error) {
    console.log("error", error);
  }
}
