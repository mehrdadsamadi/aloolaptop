import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Edit, Home, MapPin, Star, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { IAddress } from '@/types/admin/address.type'
import { useConfirm } from '@/hooks/useConfirm'

interface AddressCardProps {
  address: IAddress
  isSelected: boolean
  onSelect: () => void
  onEdit: () => void
  onDelete: () => void
  onSetDefault: () => void
}

export function AddressCard({ address, isSelected, onSelect, onEdit, onDelete, onSetDefault }: AddressCardProps) {
  const { confirm } = useConfirm()

  return (
    <Card
      className={cn('cursor-pointer transition-all hover:border-primary', isSelected && 'border-2 border-primary bg-primary/5')}
      onClick={onSelect}
    >
      <CardContent className="pt-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <Home className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-semibold">{address.title}</h3>
            {address.isDefault && (
              <Badge
                variant="secondary"
                className="text-xs"
              >
                پیش‌فرض
              </Badge>
            )}
          </div>
          {isSelected && <CheckCircle className="h-5 w-5 text-green-500" />}
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
            <p className="text-muted-foreground leading-relaxed">{address.address}</p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-muted-foreground">شهر: </span>
              <span>{address.city}</span>
            </div>
            <div>
              <span className="text-muted-foreground">کد پستی: </span>
              <span>{address.postalCode}</span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between pt-0">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              onEdit()
            }}
          >
            <Edit className="h-4 w-4" />
            ویرایش
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              confirm({
                title: 'حذف آدرس',
                description: `آیا از حذف "${address.title}" مطمئن هستید؟`,
                confirmText: 'حذف',
                cancelText: 'انصراف',
                onConfirm: onDelete,
              })
            }}
          >
            <Trash2 className="h-4 w-4" />
            حذف
          </Button>
        </div>

        {!address.isDefault && (
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              onSetDefault()
            }}
          >
            <Star className="h-4 w-4" />
            پیش‌فرض
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
