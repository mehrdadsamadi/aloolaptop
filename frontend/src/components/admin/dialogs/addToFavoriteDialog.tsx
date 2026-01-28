'use client'

import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/common/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useEffect, useState } from 'react'
// import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { ISidebarLink } from '@/types/admin/sidebar'
import { Checkbox } from '@/components/ui/checkbox'

interface AddToFavoriteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  allLinks: ISidebarLink[]
  onUpdateFavorite: (title: string, isFavorite: boolean) => void
  onUpdateAllLinks: (links: ISidebarLink[]) => void
}

export default function AddToFavoriteDialog({
  open,
  onOpenChange,
  allLinks,
  onUpdateFavorite,
  onUpdateAllLinks,
}: AddToFavoriteDialogProps) {
  const [selectedLinks, setSelectedLinks] = useState<ISidebarLink[]>(allLinks)
  const [hasChanges, setHasChanges] = useState(false)

  // هنگام باز شدن دیالوگ، لینک‌های فعلی را بارگذاری کن
  useEffect(() => {
    if (open) {
      setSelectedLinks(allLinks)
      setHasChanges(false)
    }
  }, [open, allLinks])

  const handleToggleFavorite = (title: string) => {
    setSelectedLinks((prev) => {
      const updated = prev.map((link) => (link.title === title ? { ...link, isFavorite: !link.isFavorite } : link))
      setHasChanges(true)
      return updated
    })
  }

  const handleSaveChanges = () => {
    // به‌روزرسانی تک‌تک آیتم‌ها
    selectedLinks.forEach((link) => {
      const currentLink = allLinks.find((l) => l.title === link.title)
      if (currentLink && currentLink.isFavorite !== link.isFavorite) {
        onUpdateFavorite(link.title, link.isFavorite)
      }
    })

    // یا به‌روزرسانی همه‌ی لیست یکجا
    // onUpdateAllLinks(selectedLinks)

    onOpenChange(false)
  }

  const handleReset = () => {
    setSelectedLinks(allLinks)
    setHasChanges(false)
  }

  const handleSelectAll = () => {
    setSelectedLinks((prev) => prev.map((link) => ({ ...link, isFavorite: true })))
    setHasChanges(true)
  }

  const handleDeselectAll = () => {
    setSelectedLinks((prev) => prev.map((link) => ({ ...link, isFavorite: false })))
    setHasChanges(true)
  }

  return (
    <Dialog
      title={'مدیریت علاقه‌مندی‌ها'}
      open={open}
      onOpenChange={onOpenChange}
      size="md"
      actions={
        <>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            لغو
          </Button>
          {hasChanges && (
            <Button
              variant="outline"
              onClick={handleReset}
            >
              بازنشانی
            </Button>
          )}
          <Button
            onClick={handleSaveChanges}
            disabled={!hasChanges}
          >
            ذخیره تغییرات
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">{selectedLinks.filter((link) => link.isFavorite).length} مورد انتخاب شده</div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSelectAll}
            >
              انتخاب همه
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDeselectAll}
            >
              حذف همه
            </Button>
          </div>
        </div>

        <Separator />

        <ScrollArea
          className="h-[300px]"
          dir="rtl"
        >
          <div className="space-y-2 pr-4">
            {selectedLinks.map((link) => (
              <div
                key={link.title}
                className="flex items-center space-x-3 space-x-reverse p-2 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <Checkbox
                  id={`favorite-${link.title}`}
                  checked={link.isFavorite}
                  onCheckedChange={() => handleToggleFavorite(link.title)}
                />
                {/*<input*/}
                {/*  type={'checkbox'}*/}
                {/*  id={`favorite-${link.title}`}*/}
                {/*  checked={link.isFavorite}*/}
                {/*  onChange={() => handleToggleFavorite(link.title)}*/}
                {/*/>*/}
                <Label
                  htmlFor={`favorite-${link.title}`}
                  className="flex items-center gap-2 flex-1 cursor-pointer"
                >
                  <div className="flex items-center justify-center w-6 h-6">
                    <link.icon className="w-4 h-4" />
                  </div>
                  <span>{link.title}</span>
                  {link.items && (
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">{link.items.length} زیرمجموعه</span>
                  )}
                </Label>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="text-xs text-muted-foreground text-center">
          تغییرات در localStorage ذخیره می‌شوند و پس از بارگذاری مجدد حفظ می‌مانند
        </div>
      </div>
    </Dialog>
  )
}
