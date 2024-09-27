import UserDeepTable from '@/components/tables/user/UserDeepTable';
import { api } from '@/lib/api';
import { AllUsersDeepContext } from '@/lib/context/all-users';
import { UserDeep } from '@/lib/types';
import { useEffect, useState } from 'react';

export default function AdminUserPage() {
  const [allUsers, setAllUsers] = useState<UserDeep[]>([]);
  useEffect(() => {
    api.admin.getAllUsersDeep().then(setAllUsers);
  }, []);

  return (
    <AllUsersDeepContext.Provider value={allUsers}>
      <UserDeepTable />
    </AllUsersDeepContext.Provider>
  );
}
