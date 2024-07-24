import { Grade } from '@/types';
import { DataTable } from './DataTable';
import { columns } from './UserColumns';
import { FilterColumnContextProvider } from './context/FilterColumnContext';
import { UserSelectionRow } from './common/user-selection.type';

const mockUsers: UserSelectionRow[] = [
  {
    personalNames: 'John Doe',
    familyName: 'Adams',
    grade: Grade.IA,
    roles: ['STUDENT'],
  },
  {
    personalNames: 'Jane Doe',
    familyName: 'Smith',
    grade: Grade.IIIA,
    roles: ['STUDENT'],
  },
  {
    personalNames: 'Alice',
    familyName: 'Smith',
    roles: ['TEACHER'],
  },
  {
    personalNames: 'Bob',
    familyName: 'Smith',
    roles: ['TEACHER'],
  },
  {
    personalNames: 'Charlie',
    familyName: 'Smith',
    roles: ['TEACHER'],
  },
  {
    personalNames: 'David',
    familyName: 'Smith',
    roles: ['TEACHER'],
  },
  {
    personalNames: 'Eve',
    familyName: 'Smith',
    roles: ['TEACHER'],
  },
  {
    personalNames: 'Frank',
    familyName: 'Smith',
    roles: ['TEACHER'],
  },
  {
    personalNames: 'Grace',
    familyName: 'Smith',
    roles: ['TEACHER'],
  },
  {
    personalNames: 'Hannah',
    familyName: 'Smith',
    roles: ['TEACHER'],
  },
  {
    personalNames: 'Isaac',
    familyName: 'Smith',
    roles: ['TEACHER'],
  },
  {
    personalNames: 'Jack',
    familyName: 'Smith',
    roles: ['TEACHER'],
  },
  {
    personalNames: 'Katie',
    familyName: 'Smith',
    roles: ['TEACHER'],
  },
  {
    personalNames: 'Liam',
    familyName: 'Smith',
    roles: ['TEACHER'],
  },
  {
    personalNames: 'Mia',
    familyName: 'Smith',
    roles: ['TEACHER'],
  },
  {
    personalNames: 'Noah',
    familyName: 'Smith',
    roles: ['TEACHER'],
  },
  {
    personalNames: 'Olivia',
    familyName: 'Smith',
    roles: ['TEACHER'],
  },
  {
    personalNames: 'Peter',
    familyName: 'Smith',
    roles: ['TEACHER'],
  },
  {
    personalNames: 'Quinn',
    familyName: 'Smith',
    roles: ['TEACHER'],
  },
  {
    personalNames: 'Rachel',
    familyName: 'Smith',
    roles: ['TEACHER'],
  },
  {
    personalNames: 'Steve',
    familyName: 'Smith',
    roles: ['TEACHER'],
  },
  {
    personalNames: 'Tina',
    familyName: 'Smith',
    roles: ['TEACHER', 'ADMIN'],
  },
];

export default function UserSelectionTable({
  onFinish,
}: {
  onFinish?: () => void;
}) {
  return (
    <div className="flex justify-center">
      <div className="max-w-screen-lg flex-1 px-4 py-10">
        <FilterColumnContextProvider>
          <DataTable columns={columns} data={mockUsers} onFinish={onFinish} />
        </FilterColumnContextProvider>
      </div>
    </div>
  );
}
