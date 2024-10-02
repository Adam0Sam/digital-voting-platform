import LogTable from '@/components/tables/log/LogTable';
import { LOADER_IDS, useLoadedData } from '@/lib/loaders';

export default function UserLogsPage() {
  const user = useLoadedData(LOADER_IDS.EXTERNAL_USER);

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
