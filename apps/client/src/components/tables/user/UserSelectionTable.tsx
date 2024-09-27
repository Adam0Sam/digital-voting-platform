import { User } from '@/lib/types';
import { DataTable } from './UserDataTable';
import { userColumns } from './UserColumns';
import { FilterColumnContextProvider } from './context/FilterColumnContext';
import { useAllUsers } from '@/lib/context/all-users';
import { TablifiedUser } from './table.types';
import { tablifyUser } from './utils/tablify-users';

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
            columns={userColumns}
            data={tablifiedUsers}
            idKey="id"
            selectedRows={tablifiedSelectedUsers}
            onEnd={handleSelectionEnd}
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
