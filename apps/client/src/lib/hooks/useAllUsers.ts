import { User } from '@/lib/types';
import { useEffect, useState } from 'react';
import { UserApi } from '../api';

export default function useAllUsers() {
  const [allUsers, setAllUsers] = useState<User[]>([]);

  useEffect(() => {
    UserApi.getAll()
      .then(users => {
        setAllUsers(users);
      })
      .catch(error => console.error(error));
  }, []);

  return allUsers;
}
