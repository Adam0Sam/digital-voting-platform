import { Grades, User } from '@/lib/types';
import { DataTable } from './DataTable';
import { columns, StringifiedUser } from './UserColumns';
import { FilterColumnContextProvider } from './context/FilterColumnContext';
import useAllUsers from '@/lib/hooks/useAllUsers';

const stringifyUserTable = (users: User[]) => {
  return users.map(user => {
    return {
      id: user.id,
      personalNames: user.personalNames.join(' '),
      familyName: user.familyName,
      roles: user.roles.join(', '),
      grade: user.grade || Grades.NONE,
    };
  });
};

export default function UserSelectionTable({
  handleSelectionEnd,
  selectedUsers,
}: {
  handleSelectionEnd?: (selectedUsers: Partial<StringifiedUser>[]) => void;
  selectedUsers?: User[];
}) {
  const users = useAllUsers();
  const stringifiedUsers = stringifyUserTable(users);
  const stringifiedSelectedUsers = stringifyUserTable(selectedUsers || []);

  return (
    <div className="flex justify-center">
      <div className="min-w-0 max-w-screen-lg flex-1 px-0 py-10 sm:px-4">
        <FilterColumnContextProvider>
          <DataTable
            columns={columns}
            data={stringifiedUsers}
            idKey="id"
            selectedRows={stringifiedSelectedUsers}
            onEnd={handleSelectionEnd}
          />
        </FilterColumnContextProvider>
      </div>
    </div>
  );
}
