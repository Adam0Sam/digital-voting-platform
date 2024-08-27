import { User } from '@/lib/types';
import { useEffect, useState } from 'react';
import { api } from '../api';

export default function useAllUsers() {
  const [allUsers, setAllUsers] = useState<User[]>([]);

  useEffect(() => {
    api.users.getAllShallow().then(users => {
      setAllUsers(users);
    });
  }, []);

  return allUsers;
}
