export const AuthMessage = {
  RequiredLogin: 'وارد حساب کاربری خود شوید.',
  InvalidMobile: 'شماره موبایل معتبر نمیباشد',
  NotfoundMobile: 'کاربری با این شماره موبایل یافت نشد.',
  InvalidOtpCode: 'کد وارد شده باید ۵ عدد باشد',
  ExpireOtpCode: 'کد منقضی شده است.',
  NotExpireOtpCode: 'کد قبلی هنوز منقضی نشده است.',
  NotEqualOtpCode: 'کد معتبر نمیباشد.',
  SendOtp: (mobile: string) => `کد برای شماره موبایل ${mobile} ارسال شد.`,
} as const;
