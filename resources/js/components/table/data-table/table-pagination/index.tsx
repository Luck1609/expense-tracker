import { usePage } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Fragment } from 'react/jsx-runtime';
import { Button } from '@/components/ui/button';
import useHelper from '@/hooks/use-helper';
import { cn } from '@/lib/utils';
import type { PaginatedData } from '@/types';
import type { DataTablePaginationProps } from '../types'
import { pagination } from './pagination';
import { TableSelection } from './table-column-toggler';
import { TableRowsPerPage } from './table-rows-per-page';


export function TablePagination<TData>({
  table
}: DataTablePaginationProps<TData>) {
  const props = usePage<{ data?: PaginatedData<TData> }>().props

  // const location = props?.ziggy?.location ?? (typeof window !== 'undefined' ? window.location.pathname : '')

  const fallbackCount = table.getRowModel().rows.length
  const page = props?.data?.page ?? 1
  const perPage = props?.data?.perPage ?? (fallbackCount || 1)
  const total = props?.data?.total ?? fallbackCount
  const { parsedQuery } = useHelper()

  const lastPage = Math.max(1, Math.ceil(total / (perPage || 1)))
  const paginationData = pagination(page, lastPage)

  const handleNavigation = () => {

  }


  return (
    <div className="flex flex-col lg:flex-row items-center justify-between px-2 space-y-4 lg:space-y-0">
      <TableSelection table={table} />

      <div className="flex flex-col lg:flex-row items-center space-x-6 lg:space-x-8 space-y-4 lg:space-y-0">
        <TableRowsPerPage />

        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {page} of {lastPage}
        </div>

        <div className="flex items-center space-x-2">
          <Button
            className="h-8 w-8 p-0"
            disabled={page <= 1}
            onClick={() => handleNavigation()}
            // onClick={() => router.get(location, updateQuery('page', String(Math.max(1, page - 1))), { preserveState: true, replace: true })}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {
            paginationData?.map((page, index: number) => {
              return (
                <Fragment key={index.toString()}>
                  <Button 
                    onClick={() => handleNavigation()} 
                    // onClick={() => router.get(location, updateQuery('page', String(page)), { preserveState: true, replace: true })} 
                    className={cn("size-8 rounded-md")} 
                    variant={page === (parsedQuery?.page ? parseInt(String(parsedQuery.page)) : 1) ? 'default' : 'ghost'}
                    >
                    <span className="text-xs">{page}</span>
                  </Button>
                </Fragment>
              )
            })
          }

          <Button
            className="h-8 w-8 p-0"
            disabled={page >= lastPage}
            onClick={() => handleNavigation()}
            // onClick={() => router.get(location, updateQuery('page', String(Math.min(lastPage, page + 1))), { preserveState: true, replace: true })}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
