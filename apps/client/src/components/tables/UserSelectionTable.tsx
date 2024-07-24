import { Grade } from '@/types';
import { DataTable } from './DataTable';
import { columns } from './UserColumns';
import { FilterColumnContextProvider } from './FilterColumnContext';

export type UserSelectionRow = {
  personalNames: string;
  familyName: string;
  grade?: Grade;
  roles: string[];
};

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
    roles: ['TEACHER'],
  },
];

export default function UserSelectionTable() {
  return (
    <div className="flex justify-center">
      <div className="max-w-screen-md flex-1 py-10">
        <FilterColumnContextProvider>
          <DataTable columns={columns} data={mockUsers} />
        </FilterColumnContextProvider>
      </div>
    </div>
  );
}
