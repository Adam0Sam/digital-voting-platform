import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import useFilterColumn from './context/FilterColumnContext';
import useWindowSize from '@/lib/hooks/useWindowSize';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  idKey: keyof TData;
  selectedRows?: TData[];
  onEnd?: (selectedRows: Partial<TData>[]) => void;
  rowVisibilityWidths?: Record<string, number>;
}

const getVisibilityStateFromRowVisibilityWidths = (
  rowVisibilityWidths?: Record<string, number>,
) => {
  const visibilityState: VisibilityState = {};
  for (const [key, width] of Object.entries(rowVisibilityWidths ?? {})) {
    visibilityState[key] = window.innerWidth > width;
  }
  return visibilityState;
};

// TODO: Should I even make this a generic DataTable? Can I just bind it with UserColumns?
export function DataTable<TData, TValue>({
  columns,
  data,
  idKey,
  selectedRows = [],
  onEnd,
  rowVisibilityWidths,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const { filterColumn } = useFilterColumn();
  const { width: windowWidth } = useWindowSize();
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    getVisibilityStateFromRowVisibilityWidths(rowVisibilityWidths),
  );

  const [rowSelection, setRowSelection] = useState(() => {
    const selectedRowsObj: Record<string, boolean> = {};
    for (const row of selectedRows) {
      selectedRowsObj[row[idKey] as string] = true;
    }
    return selectedRowsObj;
  });
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    //TODO: How to fix this?
    getRowId: row => row[idKey] as string,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  useEffect(() => {
    setColumnVisibility(prev => ({
      ...prev,
      ...getVisibilityStateFromRowVisibilityWidths(rowVisibilityWidths),
    }));
  }, [windowWidth, rowVisibilityWidths]);

  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          placeholder={`Filter ${filterColumn}...`}
          value={table.getColumn(filterColumn)?.getFilterValue() as string}
          onChange={event =>
            table.getColumn(filterColumn)?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto hidden md:block">
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter(column => column.getCanHide())
              .map(column => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={value => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
      {onEnd && (
        <div className="flex justify-center py-4">
          <Button
            variant="secondary"
            className="w-1/2"
            onClick={() => {
              const selectedRows: Partial<TData>[] = [];
              table.getFilteredSelectedRowModel().rows.forEach(row => {
                const selectedRow: Partial<TData> = {};
                row.getAllCells().forEach(cell => {
                  if (cell.getValue()) {
                    const typedKey = cell.column.id as keyof TData;
                    const typedValue = cell.getValue() as TData[keyof TData];
                    //TODO: How to fix this?
                    selectedRow[typedKey] = typedValue;
                  }
                  // @ts-expect-error - This is a hack to get the id
                  selectedRow[idKey] = row.id;
                }),
                  selectedRows.push(selectedRow);
              });
              onEnd(selectedRows);
            }}
          >
            Submit
          </Button>
        </div>
      )}
    </div>
  );
}
