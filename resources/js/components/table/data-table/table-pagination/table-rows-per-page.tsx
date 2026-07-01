import { useForm, usePage } from '@inertiajs/react'
import { Select } from '@/components/form/select'
// import useHelper from '@/hooks/use-helper'
import type { PaginatedData } from '@/types'

export function TableRowsPerPage<TData>() {
  const props = usePage<{ data?: PaginatedData<TData>, ziggy?: { location?: string } }>().props
  const form = useForm({
    per_page: props?.data?.perPage ?? '5'
  })
  // const { updateQuery } = useHelper()
  // const location = props?.ziggy?.location ?? (typeof window !== 'undefined' ? window.location.pathname : '')

  // Get current per_page from URL or default to 5
  // const currentPerPage = props?.data?.perPage ?? 5


  // const handlePerPageChange = (value: string) => {
  //   const updatedQuery = updateQuery('per_page', value)
  //   router.get(location, updatedQuery, {
  //     preserveState: true,
  //     replace: true
  //   })
  // }
  const handleSubmit = () => {}

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2">
      <p className="text-sm font-medium min-w-[100px]">Rows per page</p>
      <Select
        name="per_page"
        options={[
          { value: '5', label: '5' },
          { value: '10', label: '10' },
          { value: '15', label: '15' },
          { value: '25', label: '25' },
          { value: '50', label: '50' },
          { value: '100', label: '100' }
        ]}
        form={form}
      />
    </form>
  )
}
