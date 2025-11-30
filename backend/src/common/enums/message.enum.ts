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
  DuplicateMobile: 'این شماره قبلاً ثبت شده است',

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
  ProfileUpdated: 'پروفایل شما با موفقیت ویرایش شد',
} as const;

export const UserAddressMessage = {
  Created: 'آدرس با موفقیت اضافه شد',
  Updated: 'آدرس با موفقیت ویرایش شد',
  Deleted: 'آدرس با موفقیت حذف شد',
  Notfound: 'آدرس یافت نشد',
  Location: 'طول و عرض جغرافیایی برای ویرایش کردن آدرس لازم است',
  changeDefault: 'آدرس مورد نظر با موفقیت پیش فرض شد',
} as const;

export const UserReviewMessage = {
  Created: 'دیدگاه شما با موفقیت ثبت شد',
  Updated: 'دیدگاه شما با موفقیت ویرایش شد',
  Deleted: 'دیدگاه شما با موفقیت حذف شد',
  Notfound: 'دیدگاه شما یافت نشد',
  changeVisibility: 'نمایش دیدگاه با موفقیت تغییر پیدا کرد',
} as const;

export const ExceptionMessage = {
  Forbidden: 'دسترسی ممنوع',
  Server: 'خطایی رخ داده است، باردیگر تلاش کنید',
  InvalidId: 'آیدی معتبر نمیباشد',
  UnUniqueSlug: 'این اسلاگ قبلا ثبت شده است',
} as const;

export const CategoryMessage = {
  Created: 'دسته بندی با موفقیت ایجاد شد',
  Updated: 'دسته بندی با موفقیت ویرایش شد',
  Deleted: 'دسته بندی با موفقیت غیر فعال شد',
  Notfound: 'دسته بندی یافت نشد',
  NotfoundParent: 'دسته بندی والد یافت نشد',
  InvalidId: 'ایدی دسته بندی معتبر نمیباشد',
  InvalidParentId: 'ایدی دسته بندی والد معتبر نمیباشد',
} as const;

export const ProductMessage = {
  Created: 'محصول با موفقیت ایجاد شد',
  Updated: 'محصول با موفقیت ویرایش شد',
  Deleted: 'محصول با موفقیت حذف شد',
  Notfound: 'محصول یافت نشد',
  ImageNotfound: 'تصویر محصول یافت نشد',
  DeleteImage: 'تصویر محصول با موفقیت حذف شد',
} as const;

export const CouponMessage = {
  Created: 'کد تخفیف با موفقیت ایجاد شد',
  Updated: 'کد تخفیف با موفقیت ویرایش شد',
  Deleted: 'کد تخفیف با موفقیت حذف شد',
  Notfound: 'کد تخفیف یافت نشد',
  Date: 'تاریخ شروع باید قبل از پایان باشد',
  ChoosProducts: 'محصولات را انتخاب کنید',
} as const;
