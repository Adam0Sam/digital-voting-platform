import { LOADER_IDS, useLoadedData } from '@/lib/loaders';

export default function UserManagePage() {
  const user = useLoadedData(LOADER_IDS.EXTERNAL_USER);
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-center text-2xl font-semibold">
        <span className="underline">Manage</span> {user.personalNames.join()}{' '}
        {user.familyName}
      </h3>
    </div>
  );
}
