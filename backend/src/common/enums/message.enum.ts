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
  ChangeOwnRole: 'شما نمیتوانید نقش خود را تغییر دهید',
  RoleAlreadyAssign: 'کاربر این نقش را از قبل دارد',
  RoleUpdated: 'نقش کاربر با موفقیت ویرایش شد',
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
  Inactive: 'دسته بندی فعال نمیباشد',
} as const;

export const ProductMessage = {
  Created: 'محصول با موفقیت ایجاد شد',
  Updated: 'محصول با موفقیت ویرایش شد',
  Deleted: 'محصول با موفقیت حذف شد',
  Notfound: 'محصول یافت نشد',
  OutOfStockByName: (productName: string) =>
    `موجودی محصول ${productName} کافی نمیباشد`,
  ImageNotfound: 'تصویر محصول یافت نشد',
  DeleteImage: 'تصویر محصول با موفقیت حذف شد',
} as const;

export const CouponMessage = {
  Created: 'کد تخفیف با موفقیت ایجاد شد',
  Updated: 'کد تخفیف با موفقیت ویرایش شد',
  Deleted: 'کد تخفیف با موفقیت حذف شد',
  Notfound: 'کد تخفیف یافت نشد',
  Invalid: 'کد تخفیف معتبر نمیباشد',
  Expire: 'کد تخفیف منقضی شده است',
  UsageLimit: 'محدودیت استفاده از کد تخفیف به حداکثر رسیده است',
  MinimumOrder: 'حداقل قیمت سبد خرید برای استفاده از کد تخفیف کاقی نمیباشد',
  CannotApplied: 'این کد تخفیف روی برای این محصولات نمیباشد',
  Date: 'تاریخ شروع باید قبل از پایان باشد',
  ChoosProducts: 'محصولات را انتخاب کنید',
} as const;

export const CartMessage = {
  Added: 'محصول با موفقیت به سبد خرید افزوده شد',
  Updated: 'تعداد محصول با موفقیت ویرایش شد',
  Deleted: 'محصول از سبد خرید با موفقیت حذف شد',
  Clear: 'سبد خرید با موفقیت حذف شد',
  NotfoundItem: 'این محصول در سبد خرید وجود ندارد',
  Notfound: 'سبد خرید یافت نشد',
  ApplyCoupon: 'کد تخفیف با موفقیت اعمال شد',
  MoreThanStock: 'تعداد انتخابی شما از تعداد موجودی این محصول بیشتر است',
  InvalidCartItemsPrice:
    'قیمت محصولات داخل سبد خرید تغییر کرده است ، ابتدا بررسی نمایید',
  Empty: 'سبد خرید خالی است',
} as const;

export const OrderMessage = {
  Notfound: 'سفارش یافت نشد',
  InvalidChangeStatus: (current, next) =>
    `نمیتوان وضعیت سفارش را از ${current} به ${next} تغییر داد`,
} as const;

export const PaymentMessage = {
  Notfound: 'پرداخت یافت نشد',
} as const;

export const CheckoutMessage = {
  Failed: 'پرداخت ناموفق بود',
  Verify: 'پرداخت با موفقیت انجام شد',
  VerifyFailed: 'تایید پرداخت ناموفق بود',
} as const;
