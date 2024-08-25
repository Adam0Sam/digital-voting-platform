import { createContext, useContext, useState } from 'react';
import { UserSelectionColumn } from '../column.enum';

type FilterColumnContextType = {
  filterColumn: string;
  setFilterColumn: React.Dispatch<React.SetStateAction<UserSelectionColumn>>;
};

const FilterColumnContext = createContext<FilterColumnContextType>({
  filterColumn: UserSelectionColumn.PersonalNames,
  setFilterColumn: () => {},
});

export const FilterColumnContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [filterColumn, setFilterColumn] = useState<UserSelectionColumn>(
    UserSelectionColumn.PersonalNames,
  );
  return (
    <FilterColumnContext.Provider value={{ filterColumn, setFilterColumn }}>
      {children}
    </FilterColumnContext.Provider>
  );
};

const useFilterColumn = () => {
  const context = useContext(FilterColumnContext);
  if (!context) {
    throw new Error(
      'useFilterColumn must be used within a FilterColumnContextProvider',
    );
  }
  return context;
};

export default useFilterColumn;
