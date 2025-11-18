export const AuthMessage = {
  // =========================
  // Login / Authentication
  // =========================
  RequiredLogin: 'وارد حساب کاربری خود شوید',

  // =========================
  // Mobile / User
  // =========================
  InvalidMobile: 'شماره موبایل معتبر نمیباشد',
  NotfoundMobile: 'کاربری با این شماره موبایل یافت نشد',

  // =========================
  // Token / Auth
  // =========================
  InvalidRefreshToken: 'توکن معتبر نمیباشد',

  // =========================
  // OTP
  // =========================
  SendSmsFailed: 'ارسال پیامک با خطا مواجه شد',
  InvalidOtpCode: 'کد وارد شده باید ۵ عدد باشد',
  ExpireOtpCode: 'کد منقضی شده است',
  NotExpireOtpCode: 'کد قبلی هنوز منقضی نشده است',
  NotEqualOtpCode: 'کد معتبر نمیباشد',

  // =========================
  // Dynamic Messages
  // =========================
  SendOtp: (mobile: string) => `کد برای شماره موبایل ${mobile} ارسال شد`,
} as const;

export const UserMessage = {
  Notfound: 'کاربری یافت نشد',
} as const;

export const ExceptionMessage = {
  Forbidden: 'دسترسی ممنوع',
  InvalidId: 'آیدی معتبر نمیباشد',
} as const;

export const CategoryMessage = {
  Created: 'دسته بندی با موفقیت ایجاد شد',
  Updated: 'دسته بندی با موفقیت ویرایش شد',
  Deleted: 'دسته بندی با موفقیت غیر فعال شد',
  Notfound: 'دسته بندی یافت نشد',
  NotfoundParent: 'دسته بندی والد یافت نشد',
  InvalidParentId: 'ایدی دسته بندی والد معتبر نمیباشد',
} as const;
