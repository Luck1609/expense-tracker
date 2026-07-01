import { EllipsisVertical } from 'lucide-react';
import type { ReactNode } from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import type { Icon } from '@/types';

export type RowActionOption = {
  label?: ReactNode;
  classNames?: {
    container?: string;
    icon?: string;
    label?: string
  }
  icon: Icon
  action: () => void
}

type RowOptions = {
  options: (RowActionOption | never)[],
  className?: string
}

export default function RowActions({ options, className }: RowOptions) {

  return (
    <div className={cn("w-full flex justify-center", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <EllipsisVertical />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {
            options.map(({ label, action, classNames, icon: ActionIcon }, index: number) => {
              return (
                <DropdownMenuItem key={index.toString()} onClick={action} className={cn("space-x-1", classNames?.container)}>
                  <ActionIcon className={cn("stroke-subtext size-4", classNames?.icon)} />
                  {label && <span className={cn("text-sm", classNames?.label)}>{label}</span>}
                </DropdownMenuItem>
              )
            })
          }
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}


// type DefaultRowActions = [
// ]

// export const defaultRowActions = () => {
//   return [
//     {
//       label: 'View',
//       className: "-space-x-0.5",
//       icon: {
//         name: Eye,
//         className: "size-5"
//       },
//       action: (routeHandler) => router.get(routeHandler('campaigns.show', { campaign: row.original.id! }))
//     },
//     {
//       label: 'Edit',
//       icon: {
//         name: EditIcon,
//         className: "size-4"
//       },
//       action: (routeHandler) => router.get(routeHandler('campaigns.edit', { campaign: row.original.id! }))
//     },
//     {
//       label: 'Delete',
//       className: "text-[var(--destructive)] hover:text-[var(--destructive)]",
//       icon: {
//         name: Trash,
//         className: "stroke-[var(--destructive)] size-4"
//       },
//       action: (routeHandler) => router.get(routeHandler('campaigns.edit', { campaign: row.original.id! }))
//     },
//   ]
// }
