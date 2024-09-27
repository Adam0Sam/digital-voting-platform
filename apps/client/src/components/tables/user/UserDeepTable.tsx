import { useAllUsersDeep } from '@/lib/context/all-users';
import { tablifyUserDeep } from './utils/tablify-users';
import { FilterColumnContextProvider } from './context/FilterColumnContext';
import { DataTable } from './UserDataTable';
import { userDeepColumns } from './UserColumns';

export default function UserDeepTable() {
  const users = useAllUsersDeep();
  const tablifiedUsers = users.map(tablifyUserDeep);
  return (
    <div className="flex justify-center">
      <div className="min-w-0 max-w-screen-lg flex-1 px-0 py-10 sm:px-4">
        <FilterColumnContextProvider>
          <DataTable
            columns={userDeepColumns}
            data={tablifiedUsers}
            idKey="id"
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
