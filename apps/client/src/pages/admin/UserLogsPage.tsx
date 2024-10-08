import GenericSpinner from '@/components/GenericSpinner';
import LogTable from '@/components/tables/log/LogTable';
import {
  LOADER_IDS,
  useAsyncLoaderValue,
  useDeferredLoadedData,
} from '@/lib/loaders';
import { Suspense } from 'react';
import { Await, useParams } from 'react-router-dom';

export default function UserLogsPage() {
  const loaderData = useDeferredLoadedData(LOADER_IDS.USER_DEEP_INFO);

  return (
    <Suspense fallback={<GenericSpinner centered />}>
      <Await resolve={loaderData.data}>{<_UserLogsPage />}</Await>
    </Suspense>
  );
}

function _UserLogsPage() {
  const { id: userID } = useParams();
  const allUsers = useAsyncLoaderValue(LOADER_IDS.USER_DEEP_INFO);
  const user = allUsers.find(u => u.id === userID);
  if (!user) {
    throw new Error('User not found');
  }
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-center text-2xl font-semibold">
        {user.personalNames.join()} {user.familyName}{' '}
        <span className="underline">Logs</span>
      </h3>
      <LogTable user={user} />
    </div>
  );
}
