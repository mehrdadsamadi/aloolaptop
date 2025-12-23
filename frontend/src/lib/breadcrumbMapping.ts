export const breadcrumbMapping: Record<string, string> = {
  '/admin': 'داشبورد',
  '/admin/users': 'کاربران',
  '/admin/categories': 'دسته ‌بندی ‌ها',
  '/admin/products': 'محصولات',
  '/admin/orders': 'سفارشات',
  '/admin/settings': 'تنظیمات',
  // می‌توانید موارد بیشتری اضافه کنید
}

export const getBreadcrumbItems = (pathname: string) => {
  const cleanPathname = pathname.split('?')[0]
  const segments = cleanPathname.split('/').filter((segment) => segment !== '')

  const items = segments.map((segment, index) => {
    const path = '/' + segments.slice(0, index + 1).join('/')

    // بررسی اگر segment یک ID است (مثل [id] در مسیرهای داینامیک)
    const isDynamicSegment = /^\[.*\]$/.test(segment) || /^\d+$/.test(segment)

    let name = breadcrumbMapping[path]

    if (!name) {
      // اگر مسیر داینامیک است، سعی کن از mapping با الگو استفاده کنی
      if (isDynamicSegment) {
        const patternPath = '/' + segments.slice(0, index).join('/') + '/[id]'
        const patternName = breadcrumbMapping[patternPath]
        if (patternName) {
          name = `جزئیات ${patternName}`
        } else {
          name = 'جزئیات'
        }
      } else {
        name = segment.charAt(0).toUpperCase() + segment.slice(1)
      }
    }

    return {
      name,
      href: isDynamicSegment ? '#' : path, // برای segmentهای داینامیک لینک نمی‌دهیم
      isLast: index === segments.length - 1,
      isDynamic: isDynamicSegment,
    }
  })

  if (!cleanPathname.startsWith('/admin')) {
    return items
  }

  return [{ name: 'داشبورد', href: '/admin', isLast: false, isDynamic: false }, ...items.filter((item) => item.href !== '/admin')]
}
