import { createContext, useContext, useState } from 'react';
import { User, UserContextInterface } from '../interfaces';

const UserContext = createContext<UserContextInterface | null>(null);

const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default useUser;
export { UserProvider };
