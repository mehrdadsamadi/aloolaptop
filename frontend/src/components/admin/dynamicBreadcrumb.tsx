'use client'

import { usePathname } from 'next/navigation'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import React from 'react'
import { getBreadcrumbItems } from '@/lib/breadcrumbMapping'

export function DynamicBreadcrumb() {
  const pathname = usePathname()
  const items = getBreadcrumbItems(pathname)

  if (items.length === 0) return null

  return (
    <Breadcrumb className="flex-1">
      <BreadcrumbList>
        {items.map((item, index) => (
          <React.Fragment key={item.href || index}>
            <BreadcrumbItem className={index === 0 ? 'hidden md:block' : ''}>
              {item.isLast || item.isDynamic ? (
                <BreadcrumbPage>{item.name}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={item.href}>{item.name}</BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {index < items.length - 1 && <BreadcrumbSeparator className="rotate-180" />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
