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

export const UnreadNotificationContext = createContext<{
  unreadNotifications: number;
  mutate: () => {
    incrementBy: (increment: number) => void;
    decrementBy: (decrement: number) => void;
    set: (count: number) => void;
  };
}>({
  unreadNotifications: 0,
  mutate: () => ({
    incrementBy: () => {},
    decrementBy: () => {},
    set: () => {},
  }),
});

export const useUnreadNotificationCount = () => {
  const context = useContext(UnreadNotificationContext);
  if (!context) {
    throw new Error(
      'useUnreadNotificationCount must be used within a UnreadNotificationContextProvider',
    );
  }
  return context;
};

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  const [isFetchingUser, setIsFetchingUser] = useState(true);

  const mutateUser = (newUserData: Partial<User>) => {
    setUser(prevUserData => {
      if (!prevUserData) return null;
      return {
        ...prevUserData,
        ...newUserData,
      };
    });
  };

  const mutateUnreadNotifications = () => ({
    incrementBy: (increment: number) => {
      setUnreadNotifications(prev => prev + increment);
    },
    decrementBy: (decrement: number) => {
      setUnreadNotifications(prev =>
        prev - decrement < 0 ? 0 : prev - decrement,
      );
    },
    set: (count: number) => {
      setUnreadNotifications(count);
    },
  });

  useEffect(() => {
    fetchUser()
      .then(userData => {
        setUser(userData);
        setIsFetchingUser(false);
        api.logger.registerSignin();
      })
      .catch(() => {
        setIsFetchingUser(false);
      })
      .then(() =>
        api.notification
          .getUnreadNotificationCount()
          .then(setUnreadNotifications),
      );
  }, []);

  return (
    <UserContext.Provider value={{ user, mutate: mutateUser, isFetchingUser }}>
      <UnreadNotificationContext.Provider
        value={{
          unreadNotifications,
          mutate: mutateUnreadNotifications,
        }}
      >
        <ThemeProvider>
          <RouterProvider router={router} />
        </ThemeProvider>
      </UnreadNotificationContext.Provider>
    </UserContext.Provider>
  );
}

export default App;
