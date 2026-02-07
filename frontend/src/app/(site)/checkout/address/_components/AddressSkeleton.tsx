export function AddressSkeleton() {
  return (
    <div className="py-8">
      {/* Skeleton برای Breadcrumb */}
      <div className="mb-8 space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-4 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-4 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
        </div>

        <div className="h-8 w-64 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-4 w-96 bg-gray-200 rounded animate-pulse"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* سمت راست: لیست آدرس‌ها Skeleton */}
        <div className="lg:col-span-2 space-y-6">
          {/* هدر آدرس‌ها */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="h-10 w-40 bg-gray-200 rounded animate-pulse"></div>
          </div>

          {/* لیست آدرس‌های Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 space-y-3 animate-pulse"
              >
                {/* هدر کارت */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 bg-gray-200 rounded"></div>
                    <div className="h-5 w-24 bg-gray-200 rounded"></div>
                    <div className="h-5 w-16 bg-gray-200 rounded"></div>
                  </div>
                  <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
                </div>

                {/* آدرس */}
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <div className="h-4 w-4 bg-gray-200 rounded mt-0.5 shrink-0"></div>
                    <div className="space-y-1 flex-1">
                      <div className="h-3 w-full bg-gray-200 rounded"></div>
                      <div className="h-3 w-3/4 bg-gray-200 rounded"></div>
                    </div>
                  </div>

                  {/* اطلاعات شهر و کد پستی */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <div className="h-3 w-12 bg-gray-200 rounded"></div>
                      <div className="h-4 w-20 bg-gray-200 rounded"></div>
                    </div>
                    <div className="space-y-1">
                      <div className="h-3 w-16 bg-gray-200 rounded"></div>
                      <div className="h-4 w-24 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>

                {/* دکمه‌های عمل */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-16 bg-gray-200 rounded"></div>
                    <div className="h-8 w-16 bg-gray-200 rounded"></div>
                  </div>
                  <div className="h-8 w-20 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>

          {/* بخش راهنمای Skeleton */}
          <div className="border rounded-lg p-6 space-y-3 animate-pulse">
            <div className="h-5 w-40 bg-gray-200 rounded"></div>
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2"
                >
                  <div className="h-4 w-4 bg-gray-200 rounded-full mt-0.5 shrink-0"></div>
                  <div className="h-4 w-full bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* سمت چپ: خلاصه سفارش Skeleton */}
        <div className="space-y-6">
          {/* کارت خلاصه سفارش */}
          <div className="border rounded-lg p-6 space-y-4 animate-pulse">
            <div className="space-y-2">
              <div className="h-5 w-32 bg-gray-200 rounded"></div>
              <div className="h-4 w-48 bg-gray-200 rounded"></div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
                <div className="h-4 w-16 bg-gray-200 rounded"></div>
              </div>
              <div className="flex items-center justify-between">
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
                <div className="h-4 w-32 bg-gray-200 rounded"></div>
              </div>
              <div className="h-px bg-gray-200"></div>
              <div className="flex items-center justify-between">
                <div className="h-5 w-32 bg-gray-200 rounded"></div>
                <div className="h-5 w-24 bg-gray-200 rounded"></div>
              </div>
            </div>

            {/* آدرس انتخابی Skeleton */}
            <div className="pt-4 border-t space-y-2">
              <div className="h-4 w-32 bg-gray-200 rounded"></div>
              <div className="h-16 w-full bg-gray-200 rounded"></div>
            </div>

            {/* دکمه ادامه */}
            <div className="h-12 w-full bg-gray-200 rounded"></div>
          </div>

          {/* کارت پشتیبانی Skeleton */}
          <div className="border rounded-lg p-6 space-y-3 animate-pulse">
            <div className="h-5 w-40 bg-gray-200 rounded"></div>
            <div className="h-10 w-full bg-gray-200 rounded"></div>
            <div className="h-10 w-full bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
