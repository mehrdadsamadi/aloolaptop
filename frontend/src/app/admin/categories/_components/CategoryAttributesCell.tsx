import { Badge } from '@/components/ui/badge'
import { AttributeType, ICategoryAttribute } from '@/types/admin/category.type'

interface Props {
  attributes?: ICategoryAttribute[]
}

export default function CategoryAttributesCell({ attributes }: Props) {
  if (!attributes || attributes.length === 0) {
    return <span className="text-muted-foreground">—</span>
  }

  return (
    <div className="flex flex-col gap-2 max-w-[300px]">
      {attributes.map((attr) => (
        <div
          key={attr.key}
          className="flex flex-wrap items-center gap-1 text-sm"
        >
          <span className="font-medium whitespace-nowrap">{attr.label}:</span>
          {renderByType(attr)}
        </div>
      ))}
    </div>
  )
}

function renderByType(attr: ICategoryAttribute) {
  switch (attr.type) {
    case AttributeType.SELECT:
      return (
        <>
          {attr.options?.map((opt) => (
            <Badge
              key={opt}
              variant="secondary"
            >
              {opt}
            </Badge>
          ))}
        </>
      )

    case AttributeType.STRING:
      return <Badge variant="outline">متنی</Badge>

    case AttributeType.NUMBER:
      return <Badge variant="outline">عددی</Badge>

    case AttributeType.BOOLEAN:
      return <Badge variant="outline">بلی / خیر</Badge>

    case AttributeType.RANGE:
      return <Badge variant="outline">بازه‌ای</Badge>

    default:
      return null
  }
}
