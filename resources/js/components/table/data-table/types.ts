import type { ColumnDef, RowSelectionState, Table } from "@tanstack/react-table";
import type { ReactNode } from "react";
import type { PaginatedData } from "@/types";

export interface DataTablePaginationProps<TData> {
  table: Table<TData>
  meta?: PaginatedData<TData[]>
}


export type PaginationMeta = {
  total: number
  perPage: number
  page: number
}

export interface DataTableProps<TData> {
  columns: ColumnDef<TData>[]
  data: TData[];
  emptyState?: ReactNode;
  loader?: {
    isLoading?: boolean;
    component?: ReactNode;
  }
  options?: {
    pagination?: {
      show: boolean
      type?: "client" | "server"
    },
    [key: string]: unknown
  };
  rowSelection?: RowSelectionState;
  onRowSelectionChange?: (state: RowSelectionState) => void;
  getRowId?: (row: TData) => string;
  components?: {
    header: (table: Table<TData>) => ReactNode
  }
  classNames?: {
    wrapper?: string;
    table?: string;
    header?: {
      tr?: string
      td?: string
    };
    cell?: {
      tr?: string;
      td?: string;
    };
  };
  // meta: PaginatedData<TData[]>
  // meta: PaginatedData<TData[]>
  // isLoading?: boolean,
  // showFilters?: boolean;
  // showTabs?: boolean;
  // tabs?: string[];
}

// export interface DataTableProps<TData, TValue> {
//   columns: ColumnDef<TData, TValue>[]
//   data: TData[];
//   options?: {
//     pagination?: {
//       show: boolean
//       type?: "client" | "server"
//     },
//     [key: string]: unknown
//   };
//   components?: {
//     header: (table: Table<TData>) => ReactNode
//   }
//   classNames?: {
//     wrapper?: string;
//     table?: string;
//     header?: {
//       tr?: string
//       td?: string
//     };
//     cell?: {
//       tr?: string;
//       td?: string;
//     };
//   };
//   // meta: PaginatedData<TData[]>
//   // meta: PaginatedData<TData[]>
//   // isLoading?: boolean,
//   // showFilters?: boolean;
//   // showTabs?: boolean;
//   // tabs?: string[];
// }


type Props = {
  show: boolean;
  url: string;
} | undefined

export type ActionsData = {
  view: Props;
  edit: Props;
  deactivate: {
    show: boolean;
  };
  delete: boolean;
  mutate: string | undefined;
  url: string;
  name: string;
}

export type DynamicButtonGroup = {
  buttonGroup?: {
    label: ReactNode;
    action: () => void
  }[]
  actions?: Partial<ActionsData>
}



export type DialogAlert = {
  title: string;
  description: string;
  url: string;
}
