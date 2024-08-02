import { User } from '@/lib/types';
import { useEffect, useState } from 'react';
import { api } from '../api';

export default function useAllUsers() {
  const [allUsers, setAllUsers] = useState<User[]>([]);

  useEffect(() => {
    api.users
      .getAll()
      .then(users => {
        setAllUsers(users);
      })
      .catch(error => console.error(error));
  }, []);

  return allUsers;
}
