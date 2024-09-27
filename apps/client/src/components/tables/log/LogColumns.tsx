import { UserActionLog } from '@/lib/types/log.type';
import { ColumnDef, FilterFn } from '@tanstack/react-table';

const timeColumnFilterFn: FilterFn<UserActionLog> = (row, id, value) => {
  const rowTime = new Date(row.original.time).getTime();
  const [end, start] = value;
  const startTime = new Date(start).getTime();
  const endTime = new Date(end).getTime();
  return rowTime >= startTime && rowTime <= endTime;
};

const actionColumnFilterFn: FilterFn<UserActionLog> = (row, id, value) => {
  return value.includes(row.original.action);
};

export const logColumns: ColumnDef<UserActionLog>[] = [
  {
    accessorKey: 'action',
    cell: ({ row }) => <div>{row.original.action}</div>,
    filterFn: actionColumnFilterFn,
  },
  {
    accessorKey: 'message',
    cell: ({ row }) => <div>{row.original.message}</div>,
  },
  {
    accessorKey: 'time',
    cell: ({ row }) => <div>{row.original.time}</div>,
    filterFn: timeColumnFilterFn,
  },
];
