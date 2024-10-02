import GenericSpinner from '@/components/forms/GenericSpinner';
import {
  LOADER_IDS,
  useAsyncLoaderValue,
  useDeferredLoadedData,
} from '@/lib/loaders';
import { Suspense } from 'react';
import { Await, useParams } from 'react-router-dom';

export default function UserManagePage() {
  const users = useDeferredLoadedData(LOADER_IDS.USER_DEEP_INFO);
  return (
    <Suspense fallback={<GenericSpinner centered />}>
      <Await resolve={users.data}>{<_UserManagePage />}</Await>
    </Suspense>
  );
}

function _UserManagePage() {
  const { id: userID } = useParams();
  const allUsers = useAsyncLoaderValue(LOADER_IDS.USER_DEEP_INFO);
  const user = allUsers.find(u => u.id === userID);
  if (!user) {
    throw new Error('User not found');
  }
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-center text-2xl font-semibold">
        <span className="underline">Manage</span> {user.personalNames.join()}{' '}
        {user.familyName}
      </h3>
      <div>
        <div className="flex flex-col gap-4">
          <h4 className="text-xl font-semibold">Roles</h4>
          <ul>
            {user.roles.map(role => (
              <li
                className="mb-4 flex items-center justify-between gap-12 rounded-md border px-2 py-4"
                key={user.id}
              >
                {role}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
