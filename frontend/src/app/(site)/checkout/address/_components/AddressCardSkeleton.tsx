// app/checkout/address/_components/AddressCardSkeleton.tsx
export function AddressCardSkeleton() {
  return (
    <div className="border rounded-lg p-4 space-y-3 animate-pulse">
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
            <div className="h-3 w-2/3 bg-gray-200 rounded"></div>
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
  )
}
