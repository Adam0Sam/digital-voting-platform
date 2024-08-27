import { UserDeep } from '@/lib/types';
import { tablifyUserDeep } from './utils';
import { DataTable } from './DataTable';
import { TablifiedUserDeep } from './table.types';
import {
  getGenericColumns,
  getUserColumnConfig,
  HeaderSortButton,
  standardHeaderContainerStyle,
} from './user-columns';
import { UserDeepSelectionColumns } from './column.enum';
import { Column } from '@tanstack/react-table';
import UserManageMoreActions from './UserManageMoreActions';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';

const genericColumnLength = getGenericColumns<TablifiedUserDeep>().length;
const columns = getUserColumnConfig<TablifiedUserDeep>({
  insertedColumns: [
    {
      pos: genericColumnLength,
      column: {
        id: 'actions',
        cell: ({ row }) => {
          const user = row.original;
          return <UserManageMoreActions user={user} />;
        },
        enableHiding: false,
      },
    },
    {
      pos: genericColumnLength - 1,
      column: {
        accessorKey: UserDeepSelectionColumns.VotesResolved,
        header: ({
          column,
        }: {
          column: Column<TablifiedUserDeep, unknown>;
        }) => {
          return (
            <TooltipProvider>
              <Tooltip>
                <div className={standardHeaderContainerStyle()}>
                  <TooltipTrigger asChild>
                    <div>Votes </div>
                  </TooltipTrigger>
                  <HeaderSortButton column={column} />
                </div>
                <TooltipContent>
                  <div className="max-w-52">
                    Number of votes resolved by the user. This includes votes
                    that have been resolved, either by the user or by a proposal
                    manager.
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        },
        cell: ({ row }) => {
          return (
            <div className="text-right font-medium">
              {row.getValue(UserDeepSelectionColumns.VotesResolved)}
            </div>
          );
        },
      },
    },
    {
      pos: genericColumnLength - 2,
      column: {
        accessorKey: UserDeepSelectionColumns.ManagedProposals,
        header: ({
          column,
        }: {
          column: Column<TablifiedUserDeep, unknown>;
        }) => {
          return (
            <TooltipProvider>
              <Tooltip>
                <div className={standardHeaderContainerStyle()}>
                  <TooltipTrigger asChild>
                    <div>Proposals</div>
                  </TooltipTrigger>
                  <HeaderSortButton column={column} />
                </div>
                <TooltipContent>
                  <div className="max-w-52">
                    Number of proposals managed by the user. This includes
                    proposals that have been created by the user or proposals
                    where the user has been added as a manager.
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        },
        cell: ({ row }) => {
          return (
            <div className="text-right font-medium">
              {row.getValue(UserDeepSelectionColumns.ManagedProposals)}
            </div>
          );
        },
      },
    },
    {
      pos: genericColumnLength - 3,
      column: {
        accessorKey: UserDeepSelectionColumns.Active,
        header: () => {
          return <p className="text-right">Active</p>;
        },
        cell: ({ row }) => {
          return (
            <div className="text-right font-medium">
              {row.getValue(UserDeepSelectionColumns.Active)}
            </div>
          );
        },
      },
    },
  ],
  handleSelectionChange(a) {
    console.log(a);
  },
});

export default function UserManageTable({ users }: { users: UserDeep[] }) {
  const tablifiedUsersDeep = users.map(tablifyUserDeep);

  return (
    <div className="flex justify-center">
      <div className="min-w-0 max-w-screen-2xl flex-1 px-0 py-10 sm:px-4">
        <DataTable
          columns={columns}
          data={tablifiedUsersDeep}
          idKey="id"
          rowVisibilityWidths={{
            roles: 1280,
            email: 1280,
            grade: 768,
            managedProposals: 1470,
            votesResolved: 1470,
          }}
          disableSubmit={true}
        >
          <Button variant="destructive" disabled>
            Deactivate Acc
          </Button>
        </DataTable>
      </div>
      ;
    </div>
  );
}
