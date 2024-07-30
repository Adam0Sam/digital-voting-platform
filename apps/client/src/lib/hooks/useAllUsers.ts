import { User } from '@/types';
import { useEffect, useState } from 'react';
import { UserApi } from '../api';

export default function useAllUsers() {
  const [allUSers, setAllUsers] = useState<User[]>([]);

  useEffect(() => {
    UserApi.getAll()
      .then(users => {
        setAllUsers(users);
      })
      .catch(error => console.error(error));
  }, []);

  return allUSers;
}
