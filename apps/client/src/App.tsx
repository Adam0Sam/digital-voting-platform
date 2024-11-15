import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from './components/theme-provider';
import { User } from '@ambassador';
import { createContext, useContext, useEffect, useState } from 'react';
import router from './app.routes';
import './App.css';
import { fetchUser } from './lib/fetch-user';
import { api } from './lib/api';

export const UserContext = createContext<{
  user: User | null;
  mutate: (newUserData: Partial<User>) => void;
  isFetchingUser: boolean;
}>({ user: null, mutate: () => {}, isFetchingUser: true });

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserContextProvider');
  }
  return context;
};

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isFetchingUser, setIsFetchingUser] = useState(true);

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
    fetchUser()
      .then(userData => {
        setUser(userData);
        setIsFetchingUser(false);
        api.logger.registerSignin();
      })
      .catch(() => {
        setIsFetchingUser(false);
      });
  }, []);

  return (
    <UserContext.Provider value={{ user, mutate, isFetchingUser }}>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </UserContext.Provider>
  );
}

export default App;
