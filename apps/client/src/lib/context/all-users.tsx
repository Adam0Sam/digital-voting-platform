import React, {
  createContext,
  PropsWithChildren,
  useEffect,
  useState,
} from 'react';
import { User } from '../types';
import { api } from '../api';

type AllUsersContextType = User[] | null;

const AllUsersContext = createContext<AllUsersContextType>(null);

export const AllUsersProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [allUsers, setAllUsers] = useState<User[] | null>(null);

  useEffect(() => {
    api.users.getAll().then(setAllUsers);
  }, []);

  return (
    <AllUsersContext.Provider value={allUsers}>
      {children}
    </AllUsersContext.Provider>
  );
};

export const useAllUsers = () => {
  const context = React.useContext(AllUsersContext);
  if (!context) {
    throw new Error('useAllUsers must be used within a AllUsersProvider');
  }
  return context;
};
