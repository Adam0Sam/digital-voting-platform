import { Column, ColumnDef } from '@tanstack/react-table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, MoreHorizontal, Filter } from 'lucide-react';
import { UserSelectionColumn } from './common/column.enum';
import useFilterColumn from './context/FilterColumnContext';
import { Checkbox } from '@/components/ui/checkbox';

export type StringifiedUser = {
  personalNames: string;
  familyName: string;
  roles: string;
  grade: string;
};

const PersonalNamesHeader = ({
  column,
}: {
  column: Column<StringifiedUser, unknown>;
}) => {
  const { setFilterColumn } = useFilterColumn();
  return (
    <div className="flex items-center justify-end gap-1">
      <p className="hidden md:block">Personal Names</p>
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
  column: Column<StringifiedUser, unknown>;
}) => {
  const { setFilterColumn } = useFilterColumn();
  return (
    <div className="flex items-center justify-end gap-1">
      <p className="hidden md:block">Family Names</p>
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

export const columns: ColumnDef<StringifiedUser>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllRowsSelected() ||
          (table.getIsSomeRowsSelected() && 'indeterminate')
        }
        onCheckedChange={value => table.toggleAllRowsSelected(!!value)}
        aria-label="Select all rows"
      />
    ),
    cell: ({ row }) => {
      return (
        <div>
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={value => row.toggleSelected(!!value)}
            aria-label={`Select row ${row.id}`}
          />
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
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
    header: () => {
      return <p className="text-right">Roles</p>;
    },
    cell: ({ row }) => {
      return (
        <div className="text-right font-medium">
          {row.getValue(UserSelectionColumn.Roles)}
        </div>
      );
    },
  },
  {
    accessorKey: UserSelectionColumn.Grade,
    header: () => {
      return <p className="text-right">Grade</p>;
    },
    cell: ({ row }) => {
      return (
        <div className="text-right font-medium">
          {row.getValue(UserSelectionColumn.Grade)}
        </div>
      );
    },
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
                  `${user.personalNames.split(' ').join('_')}-${user.familyName}-${user.roles.split(' ').join('_')}-${user.grade}`,
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
