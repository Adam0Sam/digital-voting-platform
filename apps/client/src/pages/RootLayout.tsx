import { MobileNav } from '@/components/nav';
import { DesktopNav } from '@/components/nav';
import { Toaster } from '@/components/ui/sonner';
import JWTController from '@/lib/auth/jwt-controller';

import { USER_LOADER_ID, UserLoaderReturnType } from '@/lib/loaders';
import { AUTH_PATHS } from '@/lib/routes';
import { Grades, isUser, User } from '@/lib/types';
import UserController from '@/lib/user-controller';

import { createContext, useEffect, useRef, useState } from 'react';
import { Outlet, useNavigate, useRouteLoaderData } from 'react-router-dom';

const EMPTY_USER_TEMPLATE = {
  id: '',
  personalNames: [],
  familyName: '',
  grade: Grades.NONE,
  roles: [],
  email: null,
  active: false,
} satisfies User;

export const SignedInUserContext = createContext<{
  user: User;
  mutate: (newUser: User) => void;
}>({ user: EMPTY_USER_TEMPLATE, mutate: () => {} });

export default function RootLayout() {
  const [user, setUser] = useState<User | null>(null);

  const mutate = (newUser: User) => {
    setUser(newUser);
    UserController.setItem(newUser);
  };

  const loadedData = useRouteLoaderData(USER_LOADER_ID) as UserLoaderReturnType;

  const initiallySavedUser = useRef(UserController.getItem());
  const initiallySavedJWT = useRef(JWTController.getItem());

  const navigate = useNavigate();

  useEffect(() => {
    if (loadedData) {
      setUser(loadedData.user);
      UserController.setItem(loadedData.user);
      JWTController.setItem(loadedData.idToken);
    } else if (
      initiallySavedUser.current &&
      isUser(initiallySavedUser.current) &&
      initiallySavedJWT.current &&
      typeof initiallySavedJWT.current === 'string'
    ) {
      setUser(initiallySavedUser.current);
    } else {
      UserController.removeItem();
      JWTController.removeItem();
      navigate(`/${AUTH_PATHS.SIGNIN}`);
    }
  }, [navigate, loadedData]);

  if (!user) {
    return <h1>Loading...</h1>;
  }

  return (
    <SignedInUserContext.Provider value={{ user, mutate }}>
      <div className="flex h-full flex-col">
        <div className="my-10 ml-5 md:ml-0 md:justify-center">
          <DesktopNav className="hidden md:flex" />
          <MobileNav className="md:hidden" />
        </div>
        <Outlet />
        <Toaster />
      </div>
    </SignedInUserContext.Provider>
  );
}
