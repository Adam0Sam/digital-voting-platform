import { Grades, User } from '@/lib/types';
import { DataTable } from './DataTable';
import { columns } from './UserColumns';
import { FilterColumnContextProvider } from './context/FilterColumnContext';
import useAllUsers from '@/lib/hooks/useAllUsers';
import { TablifiedUser } from './table.types';

const tablifyUser = (user: User): TablifiedUser => {
  return {
    id: user.id,
    personalNames: user.personalNames.join(' '),
    familyName: user.familyName,
    roles: user.roles.join(', '),
    grade: user.grade || Grades.NONE,
    email: user.email || '',
    active: user.active,
  };
};

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
