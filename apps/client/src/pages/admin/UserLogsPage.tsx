import LogTable from '@/components/tables/log/LogTable';
import { UserLogsLoaderReturnType } from '@/lib/loaders';
import { useLoaderData } from 'react-router-dom';

export default function UserLogsPage() {
  const userLogData = useLoaderData() as UserLogsLoaderReturnType;
  const { actionLogs, ...user } = userLogData;

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-center text-2xl font-semibold">
        {user.personalNames.join()} {user.familyName}{' '}
        <span className="underline">Logs</span>
      </h3>
      <LogTable user={user} logs={actionLogs} />
    </div>
  );
}
