import { UserActionLog, UserActions } from '@/lib/types/log.type';
import { User } from '@/lib/types';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { logColumns } from './LogColumns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { DelayedFulfill } from '@/lib/delayed-fulfill';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type LogTableProps = {
  user: User;
  logs: UserActionLog[];
};

type ColumnFiltersState = [
  {
    id: 'action';
    value: UserActionLog['action'][];
  },
  { id: 'time'; value: [string, string] },
];

export default function LogTable({ user, logs }: LogTableProps) {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([
    {
      id: 'action',
      value: Object.values(UserActions),
    },
    {
      id: 'time',
      value: [logs[0].time, logs[logs.length - 1].time],
    },
  ]);

  const table = useReactTable({
    data: logs,
    columns: logColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onPaginationChange: setPagination,
    getRowId: row => row.id,
    state: {
      pagination,
      columnFilters,
    },
  });

  const lastPageIndex = Math.floor(
    table.getFilteredRowModel().rows.length /
      table.getState().pagination.pageSize,
  );

  const delayedNavigation = new DelayedFulfill(3000);
  return (
    <div className="flex justify-center">
      <div className="flex min-w-0 max-w-screen-lg flex-1 flex-col gap-6 px-0 pb-10 sm:px-4">
        <div className="flex justify-between">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="hidden sm:block">
                Filter Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <div className="flex flex-col gap-4">
                <div>
                  {Object.values(UserActions).map(action => {
                    return (
                      <DropdownMenuCheckboxItem
                        onSelect={e => e.preventDefault()}
                        key={action}
                        className="capitalize"
                        checked={columnFilters[0].value.includes(action)}
                        onCheckedChange={() => {
                          const wasChecked =
                            columnFilters[0].value.includes(action);
                          setColumnFilters(prev => [
                            {
                              id: 'action',
                              value: wasChecked
                                ? prev[0].value.filter(v => v !== action)
                                : [...prev[0].value, action],
                            },
                            prev[1],
                          ]);
                        }}
                      >
                        {action}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
                </div>
                <Button
                  size="sm"
                  onClick={() => {
                    setColumnFilters(prev => [
                      {
                        id: 'action',
                        value:
                          columnFilters[0].value.length !== 0
                            ? []
                            : Object.values(UserActions),
                      },
                      prev[1],
                    ]);
                  }}
                >
                  {columnFilters[0].value.length !== 0 ? 'Clear' : 'Select All'}
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
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
                      onCheckedChange={value =>
                        column.toggleVisibility(!!value)
                      }
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
                    colSpan={logColumns.length}
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
          <div className="flex-[2] text-sm text-muted-foreground">
            Page {table.getState().pagination.pageIndex} of {lastPageIndex}{' '}
          </div>
          <div className="flex flex-[4] items-center justify-between gap-12">
            <Input
              placeholder="Go to page"
              className="hidden max-w-sm flex-[3] md:block"
              type="number"
              min={0}
              max={lastPageIndex}
              onChange={e => {
                delayedNavigation.reject();
                delayedNavigation.setResolveCallback(() => {
                  table.setPageIndex(Number(e.target.value));
                });
                delayedNavigation.beginResolve();
              }}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  delayedNavigation.immediateResolve();
                }
              }}
            />
            <div className="flex flex-[1] items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                className="min-w-0 flex-1"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="min-w-0 flex-1"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
