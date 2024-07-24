import { Column, ColumnDef } from '@tanstack/react-table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { ArrowUpDown, MoreHorizontal, Filter } from 'lucide-react';
import { UserSelectionColumn } from './common/column.enum';
import useFilterColumn from './FilterColumnContext';
import { UserSelectionRow } from './common/user-selection.type';

const PersonalNamesHeader = ({
  column,
}: {
  column: Column<UserSelectionRow, unknown>;
}) => {
  const { setFilterColumn } = useFilterColumn();
  return (
    <div className="flex items-center gap-1">
      <p>Personal Names</p>
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        <ArrowUpDown className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        onClick={() => setFilterColumn(UserSelectionColumn.PersonalNames)}
      >
        <Filter className="h-4 w-4" />
      </Button>
    </div>
  );
};

const FamilyNameHeader = ({
  column,
}: {
  column: Column<UserSelectionRow, unknown>;
}) => {
  const { setFilterColumn } = useFilterColumn();
  return (
    <div className="flex items-center gap-1">
      <p>Family Names</p>
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        <ArrowUpDown className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        onClick={() => setFilterColumn(UserSelectionColumn.FamilyName)}
      >
        <Filter className="h-4 w-4" />
      </Button>
    </div>
  );
};

export const columns: ColumnDef<UserSelectionRow>[] = [
  {
    accessorKey: UserSelectionColumn.PersonalNames,
    header: PersonalNamesHeader,
    cell: ({ row }) => {
      return (
        <div className="text-right font-medium">
          {row.getValue(UserSelectionColumn.PersonalNames)}
        </div>
      );
    },
  },
  {
    accessorKey: UserSelectionColumn.FamilyName,
    header: FamilyNameHeader,
    cell: ({ row }) => {
      return (
        <div className="text-right font-medium">
          {row.getValue(UserSelectionColumn.FamilyName)}
        </div>
      );
    },
  },
  {
    accessorKey: UserSelectionColumn.Roles,
    header: 'Roles',
  },
  {
    accessorKey: UserSelectionColumn.Grade,
    header: 'Grade',
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const user = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => {
                console.log(`${user.familyName} info copied to clipboard`);
                navigator.clipboard.writeText(
                  `${user.personalNames}-${user.familyName}-${user.roles.join('_')}-${user.grade ?? 'NO_GRADE'}`,
                );
              }}
            >
              Copy User Info
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View User</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    enableHiding: false,
  },
];
