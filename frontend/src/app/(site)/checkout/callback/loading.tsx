// app/checkout/callback/loading.tsx
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export default function Loading() {
  return (
    <div className="container max-w-2xl mx-auto py-8 px-4 md:px-6 min-h-[80vh]">
      {/* Header Skeleton */}
      <div className="text-center mb-8">
        <Skeleton className="h-12 w-12 rounded-full mx-auto mb-4" />
        <Skeleton className="h-8 w-64 mx-auto mb-2" />
        <Skeleton className="h-4 w-48 mx-auto" />
      </div>

      {/* Main Card Skeleton */}
      <Card className="border shadow-lg">
        <CardHeader className="space-y-4 pb-6">
          {/* Payment Status */}
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-8 w-20 rounded-full" />
          </div>

          <Separator />
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Order Details Section */}
          <div className="space-y-3">
            <Skeleton className="h-6 w-40" />
            <div className="space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-32" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-28" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </div>

          <Separator />

          {/* Payment Information */}
          <div className="space-y-3">
            <Skeleton className="h-6 w-44" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-8 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-8 w-full" />
              </div>
            </div>
          </div>

          <Separator />

          {/* Tracking Code Section */}
          <div className="space-y-3">
            <Skeleton className="h-6 w-36" />
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-8 w-40" />
              </div>
              <Skeleton className="h-3 w-full" />
            </div>
          </div>

          {/* Message Box */}
          <div className="bg-muted/30 p-4 rounded-lg space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-3 pt-6">
          <Skeleton className="h-10 w-full sm:w-1/2" />
          <Skeleton className="h-10 w-full sm:w-1/2" />
        </CardFooter>
      </Card>

      {/* Additional Info Card */}
      <Card className="mt-6 border">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3 rtl:space-x-reverse">
              <Skeleton className="h-5 w-5 rounded-full mt-1" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </div>
            <div className="flex items-start space-x-3 rtl:space-x-reverse">
              <Skeleton className="h-5 w-5 rounded-full mt-1" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading Text */}
      <div className="text-center mt-8">
        <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse mb-2">
          <Skeleton className="h-3 w-3 rounded-full animate-pulse" />
          <Skeleton
            className="h-3 w-3 rounded-full animate-pulse"
            style={{ animationDelay: '0.2s' }}
          />
          <Skeleton
            className="h-3 w-3 rounded-full animate-pulse"
            style={{ animationDelay: '0.4s' }}
          />
        </div>
        <Skeleton className="h-5 w-56 mx-auto" />
        <Skeleton className="h-4 w-48 mx-auto mt-1" />
      </div>
    </div>
  )
}
