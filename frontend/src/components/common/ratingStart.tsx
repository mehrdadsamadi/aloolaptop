// components/ui/rating-stars.tsx
import { Star, StarHalf } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RatingStarsProps {
  rating: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function RatingStars({ rating, size = 'md', className }: RatingStarsProps) {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  }

  return (
    <div className={cn('flex items-center gap-0.5', className)}>
      {[...Array(fullStars)].map((_, i) => (
        <Star
          key={`full-${i}`}
          className={cn(sizeClasses[size], 'fill-amber-400 text-amber-400')}
        />
      ))}

      {hasHalfStar && <StarHalf className={cn(sizeClasses[size], 'fill-amber-400 text-amber-400')} />}

      {[...Array(emptyStars)].map((_, i) => (
        <Star
          key={`empty-${i}`}
          className={cn(sizeClasses[size], 'text-gray-300 dark:text-gray-600')}
        />
      ))}
    </div>
  )
}
