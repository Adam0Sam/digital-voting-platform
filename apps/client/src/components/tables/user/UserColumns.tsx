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
import { UserSelectionColumn } from './column.enum';
import useFilterColumn from './context/FilterColumnContext';
import { Checkbox } from '@/components/ui/checkbox';
import { TablifiedUser } from './table.types';

const HeaderFilterButton = ({
  filterValue,
}: {
  filterValue: UserSelectionColumn;
}) => {
  const { setFilterColumn } = useFilterColumn();
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setFilterColumn(filterValue)}
    >
      <Filter className="h-4 w-4" />
    </Button>
  );
};

const HeaderSortButton = ({
  column,
}: {
  column: Column<TablifiedUser, unknown>;
}) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
    >
      <ArrowUpDown className="h-4 w-4" />
    </Button>
  );
};

const PersonalNamesHeader = ({
  column,
}: {
  column: Column<TablifiedUser, unknown>;
}) => {
  return (
    <div className="flex items-center justify-end gap-1">
      <p className="hidden lg:block">Personal Names</p>
      <div>
        <HeaderSortButton column={column} />
        <HeaderFilterButton filterValue={UserSelectionColumn.PersonalNames} />
      </div>
    </div>
  );
};

const FamilyNameHeader = ({
  column,
}: {
  column: Column<TablifiedUser, unknown>;
}) => {
  return (
    <div className="flex items-center justify-end gap-1">
      <p className="hidden lg:block">Family Names</p>
      <div>
        <HeaderSortButton column={column} />
        <HeaderFilterButton filterValue={UserSelectionColumn.FamilyName} />
      </div>
    </div>
  );
};

const EmailHeader = () => {
  return (
    <div className="flex items-center justify-end gap-1">
      <p className="hidden md:block">Email</p>
      <div>
        <HeaderFilterButton filterValue={UserSelectionColumn.Email} />
      </div>
    </div>
  );
};

export const columns: ColumnDef<TablifiedUser>[] = [
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
    accessorKey: UserSelectionColumn.Email,
    header: EmailHeader,
    cell: ({ row }) => {
      return (
        <div className="text-right font-medium">
          {row.getValue(UserSelectionColumn.Email)}
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
                navigator.clipboard.writeText(user.id);
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
