// app/checkout/address/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ArrowRight, CheckCircle, Home, MapPin, Plus } from 'lucide-react'
import { IAddress } from '@/types/admin/address.type'
import { toast } from 'sonner'
import { AddressCard } from '@/app/(site)/checkout/address/_components/AddressCard'
import { AddressFormDialog } from '@/app/(site)/checkout/address/_components/AddressFormDialog'
import { deleteAddress, getAddressList, setDefaultAddress } from '@/actions/address.action'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import Link from 'next/link'
import { AddressSkeleton } from '@/app/(site)/checkout/address/_components/AddressSkeleton'

export default function Address() {
  const router = useRouter()
  const [addresses, setAddresses] = useState<IAddress[]>([])
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [editingAddress, setEditingAddress] = useState<IAddress | null>(null)

  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)
  const [pagesCount, setPagesCount] = useState(1)

  // Fetch addresses on mount
  useEffect(() => {
    fetchAddresses()
  }, [page, limit])

  const fetchAddresses = async () => {
    try {
      setIsLoading(true)
      const res = await getAddressList({
        page,
        limit,
      })

      if (res?.addresses) {
        setAddresses(res.addresses)

        setPagesCount(res?.pagination?.pagesCount)
        // اگر آدرس پیش‌فرض وجود داشت، آن را انتخاب کن
        const defaultAddress = res.addresses.find((addr: IAddress) => addr.isDefault)
        if (defaultAddress) {
          setSelectedAddress(defaultAddress._id)
        }
      }
    } catch (error) {
      toast.error('خطایی در دریافت آدرس‌ها رخ داد')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddressSelect = (addressId: string) => {
    setSelectedAddress(addressId)
  }

  const handleSubmit = async () => {
    if (!selectedAddress) {
      toast.error('لطفاً یک آدرس انتخاب کنید')
      return
    }

    try {
      // ذخیره آدرس انتخابی در session یا context
      const response = await fetch('/api/checkout/address', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ addressId: selectedAddress }),
      })

      if (response.ok) {
        // انتقال به صفحه پرداخت
        router.push('/checkout/payment')
      }
    } catch (error) {
      toast.error('خطایی در ذخیره آدرس رخ داد')
    }
  }

  const handleDeleteAddress = async (addressId: string) => {
    try {
      const res = await deleteAddress(addressId)

      if (res?.address) {
        toast.success(res?.message)
        fetchAddresses()
        // اگر آدرس انتخابی حذف شده، انتخاب را پاک کن
        if (selectedAddress === addressId) {
          setSelectedAddress(null)
        }
      }
    } catch (error) {
      toast.error('خطایی در حذف آدرس رخ داد')
    }
  }

  const handleEditAddress = (address: IAddress) => {
    setEditingAddress(address)
    setFormOpen(true)
  }

  const handleSetDefault = async (addressId: string) => {
    try {
      const res = await setDefaultAddress(addressId)

      if (res.address) {
        toast.success(res?.message)
        fetchAddresses()
      }
    } catch (error) {
      toast.error('خطایی در تغییر آدرس پیش‌فرض رخ داد')
    }
  }

  // نمایش Skeleton در حال لودینگ
  if (isLoading) {
    return <AddressSkeleton />
  }

  return (
    <div className="py-8">
      {/* هدر صفحه */}
      <div className="mb-8 space-y-4">
        <Breadcrumb dir={'rtl'}>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/cart">سبد خرید</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className={'rotate-180'} />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/checkout/address">انتخاب آدرس</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className={'rotate-180'} />
            <BreadcrumbItem>
              <BreadcrumbPage>پرداخت</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <h1 className="text-2xl font-bold mb-2">انتخاب آدرس تحویل</h1>
        <p className="text-muted-foreground">لطفاً آدرس تحویل سفارش خود را انتخاب کنید</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* سمت راست: لیست آدرس‌ها */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              <h2 className="text-xl font-semibold">آدرس‌های شما</h2>
            </div>
            <Button
              onClick={() => {
                setEditingAddress(null)
                setFormOpen(true)
              }}
            >
              <Plus className="h-4 w-4 ml-2" />
              افزودن آدرس جدید
            </Button>
          </div>

          {addresses.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <MapPin className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">هنوز آدرسی ثبت نکرده‌اید</h3>
                <p className="text-muted-foreground text-center mb-6">برای ادامه فرآیند خرید، نیاز است حداقل یک آدرس ثبت کنید</p>
                <Button
                  onClick={() => {
                    setEditingAddress(null)
                    setFormOpen(true)
                  }}
                >
                  <Plus className="h-4 w-4 ml-2" />
                  افزودن اولین آدرس
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addresses.map((address) => (
                <AddressCard
                  key={address._id}
                  address={address}
                  isSelected={selectedAddress === address._id}
                  onSelect={() => handleAddressSelect(address._id)}
                  onEdit={() => handleEditAddress(address)}
                  onDelete={() => handleDeleteAddress(address._id)}
                  onSetDefault={() => handleSetDefault(address._id)}
                />
              ))}
            </div>
          )}

          {/* آموزش */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">راهنمای انتخاب آدرس</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>آدرس باید دقیق و کامل باشد تا پیک بتواند سفارش را تحویل دهد</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>کد پستی صحیح برای پردازش بهتر سفارش ضروری است</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>می‌توانید از نقشه برای انتخاب دقیق موقعیت استفاده کنید</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* سمت چپ: خلاصه و دکمه ادامه */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>خلاصه سفارش</CardTitle>
              <CardDescription>اطلاعات انتخاب‌شده</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">تعداد کالاها:</span>
                  <span>3 مورد</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">هزینه ارسال:</span>
                  <span>تعیین خواهد شد</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between font-semibold">
                  <span>مبلغ قابل پرداخت:</span>
                  <span>۲۵۰,۰۰۰ تومان</span>
                </div>
              </div>

              {selectedAddress && (
                <div className="pt-4 border-t">
                  <p className="text-sm font-medium mb-2">آدرس انتخابی:</p>
                  <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded">
                    {addresses.find((a) => a._id === selectedAddress)?.address}
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                size="lg"
                onClick={handleSubmit}
                disabled={!selectedAddress}
              >
                ادامه فرآیند خرید
                <ArrowRight className="h-4 w-4 mr-2" />
              </Button>
            </CardFooter>
          </Card>

          {/* اطلاعات پشتیبانی */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-3">
                <h4 className="font-medium">نیاز به کمک دارید؟</h4>
                <p className="text-sm text-muted-foreground">
                  در صورت وجود هرگونه سوال در مورد آدرس یا تحویل سفارش، با پشتیبانی تماس بگیرید
                </p>
                <Button
                  variant="outline"
                  className="w-full"
                >
                  تماس با پشتیبانی
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* دیالوگ فرم آدرس */}
      <AddressFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        address={editingAddress}
        onSuccess={() => {
          fetchAddresses()
          setFormOpen(false)
          setEditingAddress(null)
        }}
      />
    </div>
  )
}
