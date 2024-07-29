import UserController from '@/lib/user-controller';
import { User } from '@/types';
import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export type SignedInUserContextType = {
  user: User | null;
};
const SignedInUserContext = createContext<SignedInUserContextType | null>(null);

export const SignedInUserContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = UserController.getItem();
    if (!storedUser) {
      navigate('/signin');
      return;
    }
    setUser(storedUser);
  }, [navigate]);

  return (
    <SignedInUserContext.Provider value={{ user }}>
      {children}
    </SignedInUserContext.Provider>
  );
};

const useSignedInUser = () => {
  const context = useContext(SignedInUserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserContextProvider');
  }
  return context;
};

export default useSignedInUser;
