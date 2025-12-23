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
      return <Badge variant="secondary">{attr?.options}</Badge>

    case AttributeType.NUMBER:
      return <Badge variant="secondary">{attr?.options}</Badge>

    case AttributeType.BOOLEAN:
      return <Badge variant="secondary">{attr?.options ? 'بله' : 'خیر'}</Badge>

    case AttributeType.RANGE:
      return (
        <div className={'flex items-center gap-1'}>
          <p>از</p>
          <Badge variant="secondary">{attr?.options?.[0]}</Badge>
          <p>تا</p>
          <Badge variant="secondary">{attr?.options?.[1]}</Badge>
        </div>
      )

    default:
      return null
  }
}
