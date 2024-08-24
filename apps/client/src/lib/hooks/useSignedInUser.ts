'@/pages/RootLayout';
import { UserContext } from '@/App';
import { useContext } from 'react';

export const useSignedInUser = () => {
  const context = useContext(UserContext);
  const user = context.user;
  if (!user) {
    throw new Error('User is not signed in');
  }
  return {
    user,
    mutate: context.mutate,
  };
};
