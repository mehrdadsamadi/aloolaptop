// components/common/section-header.tsx
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface SectionHeaderProps {
  title: string
  subtitle?: string
  viewAllLink?: string
  viewAllText?: string
  className?: string
}

export function SectionHeader({ title, subtitle, viewAllLink, viewAllText = 'مشاهده همه', className }: SectionHeaderProps) {
  return (
    <div className={className}>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6 md:mb-8">
        <div>
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100">{title}</h2>
          {subtitle && <p className="mt-1 md:mt-2 text-sm md:text-base text-gray-600 dark:text-gray-400">{subtitle}</p>}
        </div>

        {viewAllLink && (
          <Button
            variant="ghost"
            size="sm"
            className="group gap-1.5 text-gray-600 hover:text-primary self-start sm:self-center"
          >
            <Link href={viewAllLink}>
              {viewAllText}
              <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
            </Link>
          </Button>
        )}
      </div>
    </div>
  )
}
