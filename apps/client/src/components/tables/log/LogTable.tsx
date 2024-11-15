import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
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
import { FC, Suspense, useEffect, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Actions, User } from '@ambassador';
import useUserLogs from '@/lib/hooks/useUserLogs';
import GenericSpinner from '@/components/GenericSpinner';
import constructActionFilter, { ActionFilter } from '@/lib/action-filter';

const LOGS_PER_PAGE = 10;
export default function PaginatedLogTable({ user }: { user: User }) {
  const [actionFilter, setActionFilter] = useState<ActionFilter>(
    constructActionFilter(),
  );

  const actionFilterIsEmpty = Object.values(actionFilter).every(
    value => !value,
  );

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
                  {Actions.map(action => {
                    return (
                      <DropdownMenuCheckboxItem
                        onSelect={e => e.preventDefault()}
                        key={action}
                        className="capitalize"
                        checked={actionFilter[action]}
                        onCheckedChange={() => {
                          setActionFilter(prev => ({
                            ...prev,
                            [action]: !prev[action],
                          }));
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
                    setActionFilter(
                      actionFilterIsEmpty
                        ? constructActionFilter(true)
                        : constructActionFilter(false),
                    );
                  }}
                >
                  {actionFilterIsEmpty ? 'Select All' : 'Clear All'}
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Suspense fallback={<_PaginatedLogTableSkeleton />}>
          <_PaginatedLogTable user={user} actionFilter={actionFilter} />
        </Suspense>
      </div>
    </div>
  );
}

type PaginatedLogTableProps = {
  user: User;
  actionFilter: ActionFilter;
};

const _PaginatedLogTableSkeleton = () => {
  return (
    <div className="flex-1 rounded-md border">
      <Table className="h-[800px]">
        <TableHeader>
          <TableRow></TableRow>
        </TableHeader>
        <TableBody className="flex h-full items-center justify-center">
          <TableRow>
            <TableCell colSpan={logColumns.length}>
              <GenericSpinner className="h-20 w-20" />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

const _PaginatedLogTable: FC<PaginatedLogTableProps> = ({
  user,
  actionFilter,
}) => {
  const {
    logs: pageLogs,
    getPage: getDataPage,
    pageIndex: dataPageIndex,
  } = useUserLogs(user.id, LOGS_PER_PAGE, 1, actionFilter);
  const [tablePageIndex, setTablePageIndex] = useState(1);

  useEffect(() => {
    setTablePageIndex(1);
  }, [actionFilter]);

  console.log('pageLogs', pageLogs);

  const dataPageIndexBoundary = Math.ceil(
    (pageLogs.count ?? 0) / LOGS_PER_PAGE,
  );

  const goToNextTablePage = () => {
    setTablePageIndex(prev => prev + 1);
  };
  const goToPrevTablePage = () => {
    setTablePageIndex(prev => prev - 1);
  };

  const table = useReactTable({
    data: pageLogs.data ?? [],
    columns: logColumns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    getFilteredRowModel: getFilteredRowModel(),
    getRowId: row => row.id,
  });

  return (
    <>
      <div className="flex-1 overflow-scroll rounded-md border">
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
                <TableRow key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id} className="h-16 overflow-hidden">
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
          Page {tablePageIndex} of {dataPageIndexBoundary}{' '}
        </div>
        <div className="flex flex-[4] items-center justify-between gap-12">
          {/* <Input
              placeholder="Go to page"
              className="hidden max-w-sm flex-[3] md:block"
              type="number"
              min={0}
              max={lastPossiblePage}
              onChange={e => {
                inputValue.current = Number(e.target.value);
              }}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  goToPrevTablePage();
                }
              }}
            /> */}
          <div className="flex flex-[1] items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              className="min-w-0 flex-1"
              onClick={() => {
                const canGoToPrevPage = tablePageIndex > dataPageIndex;

                if (canGoToPrevPage) {
                  goToPrevTablePage();
                } else if (tablePageIndex > 1) {
                  getDataPage('prev');
                  goToPrevTablePage();
                }
              }}
              disabled={tablePageIndex === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="min-w-0 flex-1"
              onClick={() => {
                const canGoToNextPage = tablePageIndex < dataPageIndex;
                if (canGoToNextPage) {
                  goToNextTablePage();
                } else if (tablePageIndex < dataPageIndexBoundary) {
                  getDataPage('next');
                  goToNextTablePage();
                }
              }}
              disabled={tablePageIndex === dataPageIndexBoundary}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
