import { Skeleton } from '@/components/ui/skeleton'

export default function ProductCardSkeleton({ showActions = true }) {
  return (
    <div
      className="flex flex-col rounded-[26px] bg-card-bg relative px-4.5 pt-4 pb-8 max-w-59 min-w-59 text-primary-text h-full"
      style={{
        boxShadow: '0px 2px 6px 2px rgba(0, 0, 0, 0.15); 0px 1px 2px 0px rgba(0, 0, 0, 0.3) !important',
      }}
    >
      {/* Skeleton برای لیبل وضعیت */}
      <div className="absolute top-0 right-0 rounded-tr-[26px] size-9 rounded-bl-sm">
        <Skeleton className="w-full h-full rounded-tr-[26px] rounded-bl-sm" />
      </div>

      {/* Skeleton برای تصویر */}
      <div className="size-50 overflow-hidden rounded-[18px] mx-auto">
        <Skeleton className="w-full h-full rounded-[18px]" />
      </div>

      {/* Skeleton برای امتیاز */}
      <div className="flex items-center gap-1 mt-2 mr-auto h-5">
        <Skeleton className="w-5 h-5 rounded-full" />
        <Skeleton className="w-8 h-4" />
      </div>

      {/* Skeleton برای نام محصول */}
      <div className="flex flex-col gap-2 mt-2">
        <Skeleton className="w-32 h-5" />
        <Skeleton className="w-40 h-4" />
      </div>

      {/* Skeleton برای ویژگی‌ها */}
      <div className="flex flex-col gap-2 my-4 flex-1">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center justify-between"
          >
            <Skeleton className="w-16 h-3" />
            <Skeleton className="w-20 h-3" />
          </div>
        ))}
      </div>

      {/* Skeleton برای قیمت */}
      <div className="flex flex-col">
        {/* قیمت نهایی */}
        <div className="flex items-center gap-1 justify-end">
          <Skeleton className="w-20 h-5" />
          <Skeleton className="w-8 h-2" />
        </div>

        {/* بخش تخفیف و قیمت اصلی */}
        <div className="flex items-center justify-between h-6 mt-1">
          <Skeleton className="w-16 h-5 rounded-xl" />
          <div className="flex items-center gap-1 justify-end">
            <Skeleton className="w-16 h-4" />
            <Skeleton className="w-8 h-2" />
          </div>
        </div>
      </div>

      {/* Skeleton برای دکمه‌ها */}
      {showActions && (
        <div className="grid grid-cols-5 gap-1.75 mt-5.75">
          <Skeleton className="col-span-3 h-6 rounded-[10px]" />
          <Skeleton className="col-span-1 h-6 rounded-[10px]" />
          <Skeleton className="col-span-1 h-6 rounded-[10px]" />
        </div>
      )}
    </div>
  )
}
