import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Attribute } from '@/types/admin/product.type'
import { Ellipsis } from 'lucide-react'

interface Props {
  attributes?: Attribute[]
  maxWidth?: string | number
  showLabels?: boolean
  maxVisible?: number // تعداد ویژگی‌های قابل نمایش قبل از سه نقطه
}

export default function ProductAttributesCell({
  attributes,
  maxWidth = '300px',
  showLabels = true,
  maxVisible = 1, // به طور پیش‌فرض فقط یک ویژگی نمایش داده می‌شود
}: Props) {
  if (!attributes || attributes.length === 0) {
    return <span className="text-muted-foreground">—</span>
  }

  // اگر ویژگی‌ها کمتر یا برابر با maxVisible باشند، همه را نمایش بده
  if (attributes.length <= maxVisible) {
    return (
      <div
        className="flex flex-col gap-2"
        style={{ maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth }}
      >
        {attributes.map((attr) => (
          <AttributeBadge
            key={attr.id || attr.key}
            attribute={attr}
            showLabel={showLabels}
          />
        ))}
      </div>
    )
  }

  // ویژگی‌های قابل نمایش و باقی‌مانده
  const visibleAttributes = attributes.slice(0, maxVisible)
  const remainingAttributes = attributes.slice(maxVisible)

  return (
    <div className="flex items-center gap-1">
      {/* نمایش ویژگی‌های قابل مشاهده */}
      <div className="flex flex-col gap-2">
        {visibleAttributes.map((attr) => (
          <AttributeBadge
            key={attr.id || attr.key}
            attribute={attr}
            showLabel={showLabels}
          />
        ))}
      </div>

      {/* دکمه سه نقطه با تولتیپ */}
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="cursor-pointer p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
            <Ellipsis className="h-4 w-4 text-gray-500" />
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="bottom"
          align="start"
          className="w-64 max-h-80 overflow-y-auto"
        >
          <div className="flex flex-col gap-3">
            <p className="text-xs">ویژگی‌های دیگر:</p>
            <hr />
            {remainingAttributes.map((attr) => (
              <div
                key={attr.id || attr.key}
                className="flex items-center justify-between gap-3"
              >
                <span className="text-sm">{attr.label}:</span>
                <Badge
                  variant="secondary"
                  className="text-xs whitespace-nowrap"
                >
                  {attr.value}
                </Badge>
              </div>
            ))}
          </div>
        </TooltipContent>
      </Tooltip>
    </div>
  )
}

// کامپوننت داخلی برای نمایش هر ویژگی
function AttributeBadge({ attribute, showLabel }: { attribute: Attribute; showLabel: boolean }) {
  return (
    <div className="flex items-center gap-1">
      {showLabel && <span className="font-medium whitespace-nowrap text-sm">{attribute.label}:</span>}
      <Badge
        variant="secondary"
        className="whitespace-nowrap truncate text-xs"
        title={attribute.value}
      >
        {attribute.value}
      </Badge>
    </div>
  )
}
