import UserManageTable from '@/components/tables/user/UserManageTable';
import { AdminUsersLoaderResolved } from '@/lib/loaders';
import { useLoaderData } from 'react-router-dom';

export default function UsersOverviewPage() {
  const users = useLoaderData() as AdminUsersLoaderResolved;

  return (
    <div>
      <UserManageTable users={users} />
    </div>
  );
}
