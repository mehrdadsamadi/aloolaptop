'use client'

import React, { useMemo, useState } from 'react'
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from '@tanstack/react-table'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react'
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from '@/components/ui/pagination'

/**
 * Strongly‑typed, generic DataTable component.
 */
export default function DataTable<TData, TValue>({
  columns,
  data,
  page,
  pageLimit,
  pagesCount,
  onPageChange,
  globalFilterPlaceholder = 'جستجو',
}: {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  page: number
  pageLimit: number
  pagesCount: number
  onPageChange: (page: number) => void
  globalFilterPlaceholder?: string
}) {
  const memoColumns = useMemo(() => columns, [columns])
  const memoData = useMemo(() => data, [data])

  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState('')

  const table = useReactTable({
    data: memoData,
    columns: memoColumns,
    state: {
      sorting,
      globalFilter,
      pagination: {
        pageIndex: page - 1,
        pageSize: pageLimit,
      },
    },
    manualPagination: true,
    pageCount: pagesCount,
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    // getPaginationRowModel: getPaginationRowModel(),
  })

  const headerGroups = table.getHeaderGroups()
  const rows = table.getRowModel().rows
  const pageIndex = table.getState().pagination.pageIndex
  const pageCount = table.getPageCount()

  const renderPageNumbers = () => {
    return Array.from({ length: pageCount }, (_, i) => {
      const pageNumber = i + 1

      return (
        <PaginationItem key={pageNumber}>
          <PaginationLink
            isActive={pageNumber === page}
            onClick={() => onPageChange(pageNumber)}
            className={'cursor-pointer'}
          >
            {pageNumber}
          </PaginationLink>
        </PaginationItem>
      )
    })
  }

  return (
    <div className="space-y-4 bg-gray-50 p-4 rounded-xl h-[calc(100%-44px)]">
      <div className="flex items-center justify-between">
        <Input
          placeholder={globalFilterPlaceholder}
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-xl border">
        <Table>
          <TableHeader>
            {headerGroups.map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-right"
                  >
                    {header.isPlaceholder ? null : (
                      <Button
                        variant="ghost"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.columnDef.enableSorting && <ArrowUpDown className="size-4" />}
                      </Button>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {rows.length ? (
              rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      className="pr-4"
                      key={cell.id}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={memoColumns.length}
                  className="h-24 text-center"
                >
                  داده‌ای یافت نشد
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between py-2">
        <div className="text-sm text-muted-foreground min-w-fit">
          صفحه {pageIndex} از {pageCount}
        </div>

        <Pagination className={'w-full'}>
          <PaginationContent className={'w-full justify-center gap-4'}>
            <PaginationItem>
              <PaginationLink
                onClick={() => onPageChange(page - 1)}
                aria-disabled={page === 1}
                className={page === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              >
                <ChevronRight className="" />
                قبلی
              </PaginationLink>
            </PaginationItem>

            {renderPageNumbers()}

            <PaginationItem>
              <PaginationLink
                onClick={() => onPageChange(page + 1)}
                aria-disabled={page === pageCount}
                className={page === pageCount ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              >
                بعدی
                <ChevronLeft className="" />
              </PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}
