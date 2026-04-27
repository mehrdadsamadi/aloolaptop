// components/ui/rating.tsx
'use client'

import { Star } from 'lucide-react'

interface RatingProps {
  value: number
  onChange: (value: number) => void
  iconSize?: string
}

export function Rating({ value, onChange, iconSize = 'h-5 w-5' }: RatingProps) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className="focus:outline-none"
        >
          <Star
            className={`cursor-pointer ${iconSize} ${
              star <= value ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 hover:text-yellow-400 transition-colors'
            }`}
          />
        </button>
      ))}
    </div>
  )
}
