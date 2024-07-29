import { User } from '@/types';
import { useEffect, useState } from 'react';
import { UserApi } from '../api';

const fetchAllUsers = async () => {
  const res = await UserApi.getAll();
  const users = await res.json();
  return users as User[];
};

export default function useAllUsers() {
  const [allUSers, setAllUsers] = useState<User[]>([]);

  useEffect(() => {
    fetchAllUsers().then(users => {
      setAllUsers(users);
    });
  }, []);

  return allUSers;
}
