import { Column, ColumnDef, Row } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, Filter } from 'lucide-react';
import { UserSelectionColumn } from './column.enum';
import useFilterColumn from './context/FilterColumnContext';
import { Checkbox } from '@/components/ui/checkbox';
import { TablifiedUser } from './table.types';

export const standardHeaderContainerStyle = () => {
  return 'flex items-center justify-end gap-1';
};

export function HeaderFilterButton({
  filterValue,
}: {
  filterValue: UserSelectionColumn;
}) {
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
}

export function HeaderSortButton<T extends TablifiedUser>({
  column,
}: {
  column: Column<T, unknown>;
}) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
    >
      <ArrowUpDown className="h-4 w-4" />
    </Button>
  );
}

function PersonalNamesHeader<T extends TablifiedUser>({
  column,
}: {
  column: Column<T, unknown>;
}) {
  return (
    <div className={standardHeaderContainerStyle()}>
      <p className="hidden lg:block">Personal Names</p>
      <div>
        <HeaderSortButton column={column} />
        <HeaderFilterButton filterValue={UserSelectionColumn.PersonalNames} />
      </div>
    </div>
  );
}

function FamilyNameHeader<T extends TablifiedUser>({
  column,
}: {
  column: Column<T, unknown>;
}) {
  return (
    <div className={standardHeaderContainerStyle()}>
      <p className="hidden lg:block">Family Names</p>
      <div>
        <HeaderSortButton column={column} />
        <HeaderFilterButton filterValue={UserSelectionColumn.FamilyName} />
      </div>
    </div>
  );
}

function EmailHeader() {
  return (
    <div className={standardHeaderContainerStyle()}>
      <p className="hidden md:block">Email</p>
      <div>
        <HeaderFilterButton filterValue={UserSelectionColumn.Email} />
      </div>
    </div>
  );
}

type InsertedColumn<T extends TablifiedUser> = {
  pos: number;
  column: ColumnDef<T>;
};

export function getGenericColumns<T extends TablifiedUser>(
  handleSelectionChange?: (row: Row<T>) => void,
): ColumnDef<T>[] {
  return [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllRowsSelected() ||
            (table.getIsSomeRowsSelected() && 'indeterminate')
          }
          onCheckedChange={value => {
            table.toggleAllRowsSelected(!!value);
          }}
          aria-label="Select all rows"
        />
      ),
      cell: ({ row }) => {
        return (
          <div>
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={value => {
                row.toggleSelected(!!value);
                handleSelectionChange?.(row);
              }}
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
  ];
}
type ColumnConfigProps<T extends TablifiedUser> = {
  insertedColumns?: InsertedColumn<T>[];
  handleSelectionChange?: (row: Row<T>) => void;
};
export function getUserColumnConfig<T extends TablifiedUser>(
  props: ColumnConfigProps<T> = {},
): ColumnDef<T>[] {
  let increasedLength = 0;
  const columns = getGenericColumns<T>(props?.handleSelectionChange);
  if (!props.insertedColumns) return columns;
  props?.insertedColumns.forEach(({ pos, column }) => {
    if (pos > 0 && pos <= columns.length) {
      columns.splice(pos + increasedLength, 0, column);
      increasedLength += 1;
    }
  });
  return columns;
}
