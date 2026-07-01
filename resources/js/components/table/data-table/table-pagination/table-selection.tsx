import React from 'react'
import type { DataTablePaginationProps } from '../types'



export function TableSelection<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  return (
    <div className="flex-1 text-sm text-muted-foreground">
      {table.getFilteredSelectedRowModel().rows.length} of{" "}
      {table.getFilteredRowModel().rows.length} row(s) selected.
    </div>
  )
}
