import { User } from '@/lib/types';
import { DataTable } from './DataTable';
import { getUserColumnConfig } from './user-columns';
import useAllUsers from '@/lib/hooks/useAllUsers';
import { TablifiedUser } from './table.types';
import { tablifyUser } from './utils';
import { FilterColumnContextProvider } from './context/FilterColumnContext';

const columns = getUserColumnConfig<TablifiedUser>();

export default function UserSelectionTable({
  handleSelectionEnd,
  selectedUsers,
}: {
  handleSelectionEnd?: (selectedUsers: Partial<TablifiedUser>[]) => void;
  selectedUsers?: User[];
}) {
  const users = useAllUsers();
  const tablifiedUsers = users.map(tablifyUser);
  const tablifiedSelectedUsers = (selectedUsers || []).map(tablifyUser);

  return (
    <div className="flex justify-center">
      <div className="min-w-0 max-w-screen-lg flex-1 px-0 py-10 sm:px-4">
        <FilterColumnContextProvider>
          <DataTable
            columns={columns}
            data={tablifiedUsers}
            idKey="id"
            selectedRows={tablifiedSelectedUsers}
            handleSubmit={handleSelectionEnd}
            rowVisibilityWidths={{
              roles: 1280,
              email: 1280,
              grade: 768,
            }}
          />
        </FilterColumnContextProvider>
      </div>
    </div>
  );
}
