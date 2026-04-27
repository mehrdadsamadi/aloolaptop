// components/product/product-reviews.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import { Star, Calendar, MessageSquare, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useUser } from '@/hooks/useUser'
import { toast } from 'sonner'
import { formatPersianDate, getFullName, showError } from '@/lib/utils'
import { getProductReviewsList } from '@/actions/review.action'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { Rating } from '@/components/ui/rating'
import { IReview } from '@/types/admin/review.type'
import AddReviewDialog from '@/components/admin/dialogs/addReviewDialog'

interface ProductReviewsProps {
  productId: string
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const loadMoreRef = useRef<HTMLDivElement>(null)

  const [reviews, setReviews] = useState<IReview[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [addReviewDialogOpen, setAddReviewDialogOpen] = useState(false)
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest' | 'lowest'>('newest')
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pagesCount: 1,
    hasMore: true,
  })

  // محاسبه آمار نظرات
  const averageRating = reviews.length > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0

  const ratingDistribution = {
    5: reviews.filter((r) => r.rating === 5).length,
    4: reviews.filter((r) => r.rating === 4).length,
    3: reviews.filter((r) => r.rating === 3).length,
    2: reviews.filter((r) => r.rating === 2).length,
    1: reviews.filter((r) => r.rating === 1).length,
  }

  // بارگذاری نظرات با pagination
  const fetchReviews = async (pageNum: number, isLoadMore = false) => {
    try {
      if (isLoadMore) {
        setLoadingMore(true)
      } else {
        setLoading(true)
      }

      const res = await getProductReviewsList(productId, {
        page: pageNum,
        limit: pagination.limit,
      })

      if (res?.ok === false) {
        showError(res.messages)
        return
      }

      const newReviews = res?.reviews || []
      const total = res?.pagination?.total || 0
      const pagesCount = res?.pagination?.pagesCount || 1
      const currentPage = res?.pagination?.page || pageNum

      if (isLoadMore) {
        setReviews((prev) => [...prev, ...newReviews])
      } else {
        setReviews(newReviews)
      }

      setPagination({
        page: currentPage,
        limit: pagination.limit,
        total,
        pagesCount,
        hasMore: currentPage < pagesCount,
      })
    } catch (error) {
      console.error('Error fetching reviews:', error)
      toast.error('خطا در بارگذاری نظرات')
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  // بارگذاری اولیه
  useEffect(() => {
    if (productId) {
      setPagination((prev) => ({ ...prev, page: 1, hasMore: true }))
      fetchReviews(1, false)
    }
  }, [productId, sortBy])

  // تنظیم observer برای infinite scroll
  useEffect(() => {
    if (!loadMoreRef.current || !pagination.hasMore || loading || loadingMore) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && pagination.hasMore && !loadingMore && !loading) {
          const nextPage = pagination.page + 1
          fetchReviews(nextPage, true)
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    )

    observer.observe(loadMoreRef.current)

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current)
      }
    }
  }, [pagination.hasMore, pagination.page, loadingMore, loading, sortBy])

  // تابع کمکی برای گرفتن حروف اول نام
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase()
  }

  if (loading && reviews.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex gap-8">
          <Skeleton className="h-32 w-48" />
          <Skeleton className="h-32 flex-1" />
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="space-y-2"
            >
              <div className="flex gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* header with stats */}
      <div className="bg-gradient-to-r from-primary/5 to-transparent rounded-2xl p-6">
        <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
          <div className="flex items-center gap-6">
            {/* average rating */}
            <div className="text-center">
              <div className="text-5xl font-bold text-primary">{averageRating.toFixed(1)}</div>
              <div className="flex items-center gap-1 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${star <= Math.round(averageRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <div className="text-sm text-muted-foreground mt-2">از {pagination.total} نفر</div>
            </div>

            {/* rating distribution */}
            <div className="flex-1 min-w-[200px] space-y-1.5">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = ratingDistribution[star as keyof typeof ratingDistribution]
                const percentage = pagination.total > 0 ? (count / pagination.total) * 100 : 0
                return (
                  <div
                    key={star}
                    className="flex items-center gap-2 text-sm"
                  >
                    <span className="">{star} ستاره</span>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-400 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="w-12 text-muted-foreground">{count}</span>
                  </div>
                )
              })}
            </div>
          </div>

          <Button
            className="gap-2"
            onClick={() => setAddReviewDialogOpen(true)}
          >
            <MessageSquare className="h-4 w-4" />
            ثبت نظر جدید
          </Button>
        </div>
      </div>

      <Separator />

      {/* sort and filter */}
      {/* {!!reviews?.length && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {reviews.filter((rvw) => rvw?.comment).length} از {pagination.total} نظر
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">مرتب‌سازی:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-sm border rounded-lg px-2 py-1 bg-background cursor-pointer"
            >
              <option value="newest">جدیدترین</option>
              <option value="oldest">قدیمی‌ترین</option>
              <option value="highest">بیشترین امتیاز</option>
              <option value="lowest">کمترین امتیاز</option>
            </select>
          </div>
        </div>
      )} */}

      {/* reviews list with infinite scroll */}
      {reviews.length === 0 ? (
        <div className="text-center py-12 rounded-lg bg-gray-50">
          <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">هنوز نظری برای این محصول ثبت نشده است</p>
          <p className="text-sm text-muted-foreground mt-2">اولین نفری باشید که نظر خود را ثبت می‌کنید</p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews
            .filter((rvw) => rvw?.comment)
            .map((review, index) => (
              <div
                key={review._id}
                className={`p-6 rounded-xl bg-white border hover:shadow-md transition-shadow ${
                  index === 0 ? 'border-primary/30' : 'border-gray-100'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-10 w-10">
                      {review.userId?.profile?.avatar ? (
                        <AvatarImage
                          src={review.userId.profile.avatar.url}
                          alt={review.userId.profile.firstName}
                          className="object-cover"
                        />
                      ) : (
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {getInitials(review.userId?.profile?.firstName || '', review.userId?.profile?.lastName || '')}
                        </AvatarFallback>
                      )}
                    </Avatar>

                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="font-semibold">{getFullName(review.userId?.profile)}</h4>
                        {/* {review.isVisible && (
                        <Badge
                          variant="secondary"
                          className="text-[10px]"
                        >
                          خریدار تایید شده
                        </Badge>
                      )} */}
                      </div>

                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>{formatPersianDate(review.createdAt)}</span>
                        </div>
                      </div>

                      <p className="text-gray-700 leading-relaxed mt-2">{review.comment}</p>

                      {/* <div className="flex items-center gap-4 mt-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1 text-muted-foreground"
                      >
                        <ThumbsUp className="h-3.5 w-3.5" />
                        <span className="text-xs">مفید بود</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1 text-muted-foreground"
                      >
                        <Flag className="h-3.5 w-3.5" />
                        <span className="text-xs">گزارش</span>
                      </Button>
                    </div> */}
                    </div>
                  </div>

                  {/* <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button> */}
                </div>
              </div>
            ))}

          {/* لودینگ بیشتر و عنصر observer */}
          <div
            ref={loadMoreRef}
            className="py-4"
          >
            {loadingMore && (
              <div className="flex justify-center items-center gap-2 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="text-sm">در حال بارگذاری نظرات بیشتر...</span>
              </div>
            )}
            {!pagination.hasMore && reviews.length > 0 && (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground">✓ پایان لیست نظرات</p>
              </div>
            )}
          </div>
        </div>
      )}

      <AddReviewDialog
        open={addReviewDialogOpen}
        onOpenChange={setAddReviewDialogOpen}
        productId={productId}
        onComplete={() => {
          setPagination((prev) => ({ ...prev, page: 1, hasMore: true }))
          fetchReviews(1, false)
        }}
      />
    </div>
  )
}
