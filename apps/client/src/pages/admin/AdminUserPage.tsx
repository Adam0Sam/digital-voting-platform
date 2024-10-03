import GenericSpinner from '@/components/forms/GenericSpinner';
import UserDeepTable from '@/components/tables/user/UserDeepTable';
import { AllUsersDeepContext } from '@/lib/context/all-users';
import {
  LOADER_IDS,
  useAsyncLoaderValue,
  useDeferredLoadedData,
} from '@/lib/loaders';
import { Suspense } from 'react';
import { Await } from 'react-router-dom';

export default function AdminUserPage() {
  const loaderData = useDeferredLoadedData(LOADER_IDS.USER_DEEP_INFO);
  return (
    <Suspense fallback={<GenericSpinner centered />}>
      <Await resolve={loaderData.data}>{<_AdminUsersPage />}</Await>
    </Suspense>
  );
}

function _AdminUsersPage() {
  const data = useAsyncLoaderValue(LOADER_IDS.USER_DEEP_INFO);
  return (
    <AllUsersDeepContext.Provider value={data}>
      <UserDeepTable />
    </AllUsersDeepContext.Provider>
  );
}
