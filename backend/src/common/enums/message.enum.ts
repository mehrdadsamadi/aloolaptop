export const AuthMessage = {
  // =========================
  // Login / Authentication
  // =========================
  RequiredLogin: 'وارد حساب کاربری خود شوید.',

  // =========================
  // Mobile / User
  // =========================
  InvalidMobile: 'شماره موبایل معتبر نمیباشد',
  NotfoundMobile: 'کاربری با این شماره موبایل یافت نشد.',

  // =========================
  // OTP
  // =========================
  SendSmsFailed: 'ارسال پیامک با خطا مواجه شد.',
  InvalidOtpCode: 'کد وارد شده باید ۵ عدد باشد',
  ExpireOtpCode: 'کد منقضی شده است.',
  NotExpireOtpCode: 'کد قبلی هنوز منقضی نشده است.',
  NotEqualOtpCode: 'کد معتبر نمیباشد.',

  // =========================
  // Dynamic Messages
  // =========================
  SendOtp: (mobile: string) => `کد برای شماره موبایل ${mobile} ارسال شد.`,
} as const;
