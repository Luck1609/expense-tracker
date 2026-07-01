import { router } from '@inertiajs/react'
import type { Table } from '@tanstack/react-table'
import { Filter, Search } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import useHelper from '@/hooks/use-helper'
import { cn } from '@/lib/utils'

interface Props<TData> {
  table: Table<TData>;
  className?: string;
  fields?: string[]
  routeName?: string;
  showFilter?: boolean;
}

export default function TableFilter<TData>({ table, className, routeName, showFilter=true }: Props<TData>) {
  const columns = table.getAllColumns();
  const { updateQuery } = useHelper();
  const [openDropdown, setOpenDropdown] = useState(false)

  // Handle search - using dashboard approach with dynamic route
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchQuery = updateQuery('search', e.target.value)
    const currentLocation = window.location.pathname

    if (routeName) {
      router.get(route(routeName), searchQuery, {
        preserveState: true,
        replace: true
      })
    } else {
      router.get(currentLocation, searchQuery, {
        preserveState: true,
        replace: true
      })
    }
  };

  const toggleDropdown = () => setOpenDropdown(prev => !prev)

  return (
    <div className={cn("lg:w-[400px] flex items-center space-x-3", className)}>
      <div className="w-full bg-white flex items-center gap-2 relative">
        <Search className="absolute left-2.5 top-3 size-4" />
        <Input
          placeholder="Search by agency name"
          onChange={handleSearch}
          className="w-full lg:flex-1 border shadow-none pl-8"
          type="search"
        />
      </div>

    {showFilter && (
  
        <DropdownMenu open={openDropdown} onOpenChange={toggleDropdown}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="ml-auto">
            <Filter />
            Filters
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          {
            columns
              .filter((column) => column.getCanHide())
              .map(column => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >{column.id.split("_").join(" ")}</DropdownMenuCheckboxItem>
                )
              })}
        </DropdownMenuContent>
      </DropdownMenu>

    )}
  
    </div>
  )
}

