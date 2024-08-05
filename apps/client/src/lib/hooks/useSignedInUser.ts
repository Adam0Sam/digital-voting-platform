import { SignedInUserContext } from '@/pages/RootLayout';
import { useContext } from 'react';

export const useSignedInUser = () => {
  const context = useContext(SignedInUserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserContextProvider');
  }
  return context;
};
