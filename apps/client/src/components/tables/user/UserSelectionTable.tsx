import { Grade, User } from '@/types';
import { DataTable } from './DataTable';
import { columns, StringifiedUser } from './UserColumns';
import { FilterColumnContextProvider } from './context/FilterColumnContext';

const mockUsers: User[] = [
  {
    id: '2',
    personalNames: ['Jane Doe'],
    familyName: 'Smith',
    grade: Grade.IIIA,
    roles: ['STUDENT'],
  },
  {
    id: '32',
    personalNames: ['John Doe'],
    familyName: 'Adams',
    grade: Grade.IA,
    roles: ['STUDENT'],
  },
  {
    id: '3',
    personalNames: ['Alice'],
    familyName: 'Smith',
    roles: ['TEACHER'],
  },
  {
    id: '4',
    personalNames: ['Bob'],
    familyName: 'Smith',
    roles: ['TEACHER'],
  },
  {
    id: '5',
    personalNames: ['Charlie'],
    familyName: 'Smith',
    roles: ['TEACHER'],
  },
  {
    id: '6',
    personalNames: ['David'],
    familyName: 'Smith',
    roles: ['TEACHER'],
  },
  {
    id: '7',
    personalNames: ['Eve'],
    familyName: 'Smith',
    roles: ['TEACHER'],
  },
  {
    id: '8',
    personalNames: ['Frank'],
    familyName: 'Smith',
    roles: ['TEACHER'],
  },
  {
    id: '9',
    personalNames: ['Grace'],
    familyName: 'Smith',
    roles: ['TEACHER'],
  },
  {
    id: '10',
    personalNames: ['Hannah'],
    familyName: 'Smith',
    roles: ['TEACHER'],
  },
  {
    id: '11',
    personalNames: ['Isaac'],
    familyName: 'Smith',
    roles: ['TEACHER'],
  },
  {
    id: '12',
    personalNames: ['Jack'],
    familyName: 'Smith',
    roles: ['TEACHER'],
  },
  {
    id: '13',
    personalNames: ['Katie'],
    familyName: 'Smith',
    roles: ['TEACHER'],
  },
  {
    id: '14',
    personalNames: ['Liam'],
    familyName: 'Smith',
    roles: ['TEACHER'],
  },
  {
    id: '15',
    personalNames: ['Mia'],
    familyName: 'Smith',
    roles: ['TEACHER'],
  },
  {
    id: '16',
    personalNames: ['Noah'],
    familyName: 'Smith',
    roles: ['TEACHER'],
  },
  {
    id: '17',
    personalNames: ['Olivia'],
    familyName: 'Smith',
    roles: ['TEACHER'],
  },
  {
    id: '18',
    personalNames: ['Peter'],
    familyName: 'Smith',
    roles: ['TEACHER'],
  },
  {
    id: '19',
    personalNames: ['Quinn'],
    familyName: 'Smith',
    roles: ['TEACHER'],
  },
  {
    id: '20',
    personalNames: ['Rachel'],
    familyName: 'Smith',
    roles: ['TEACHER'],
  },
  {
    id: '21',
    personalNames: ['Steve'],
    familyName: 'Smith',
    roles: ['TEACHER'],
  },
  {
    id: '22',
    personalNames: ['Tina'],
    familyName: 'Smith',
    roles: ['TEACHER', 'ADMIN'],
  },
];

const stringifyUserTable = (users: User[]) => {
  return users.map(user => {
    return {
      id: user.id,
      personalNames: user.personalNames.join(' '),
      familyName: user.familyName,
      roles: user.roles.join(', '),
      grade: user.grade || 'N/A',
    };
  });
};

const mockTableData = stringifyUserTable(mockUsers);

export default function UserSelectionTable({
  handleSelectionEnd,
  selectedUsers,
}: {
  handleSelectionEnd?: (selectedUsers: Partial<StringifiedUser>[]) => void;
  selectedUsers?: User[];
}) {
  const stringifiedSelectedUsers = stringifyUserTable(selectedUsers || []);

  return (
    <div className="flex justify-center">
      <div className="min-w-0 max-w-screen-lg flex-1 px-0 py-10 sm:px-4">
        <FilterColumnContextProvider>
          <DataTable
            columns={columns}
            data={mockTableData}
            idKey="id"
            selectedRows={stringifiedSelectedUsers}
            onEnd={handleSelectionEnd}
          />
        </FilterColumnContextProvider>
      </div>
    </div>
  );
}
