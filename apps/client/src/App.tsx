import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from './components/theme-provider';
import { Grades, User } from './lib/types';
import { createContext, useContext, useEffect, useState } from 'react';
import JWTController from './lib/auth/jwt-controller';
import { api } from './lib/api';
import router from './app.routes';
import './App.css';

const EMPTY_USER_TEMPLATE = {
  id: '',
  personalNames: [],
  familyName: '',
  grade: Grades.NONE,
  roles: [],
  email: null,
  active: false,
} satisfies User;

export const fetchUser: (idToken?: string | null) => Promise<User> = async (
  idToken = JWTController.getItem(),
) => {
  if (!idToken) {
    throw new Error('No id_token found');
  }
  const user = await api.users.getOne(idToken);
  return user;
};

export const UserContext = createContext<{
  user: User | null;
  mutate: (newUserData: Partial<User>) => void;
}>({ user: EMPTY_USER_TEMPLATE, mutate: () => {} });

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserContextProvider');
  }
  return context;
};

function App() {
  const [user, setUser] = useState<User | null>(null);

  const mutate = (newUserData: Partial<User>) => {
    setUser(prevUserData => {
      if (!prevUserData) return null;
      return {
        ...prevUserData,
        ...newUserData,
      };
    });
  };

  useEffect(() => {
    fetchUser().then(setUser);
  }, []);

  return (
    <UserContext.Provider value={{ user, mutate }}>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </UserContext.Provider>
  );
}

export default App;
