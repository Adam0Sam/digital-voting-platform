import LogTable from '@/components/tables/log/LogTable';
import { UserLogsLoaderReturnType } from '@/lib/loaders';
import { useLoaderData } from 'react-router-dom';

export default function UserLogsPage() {
  const userLogs = useLoaderData() as UserLogsLoaderReturnType;
  return <LogTable logs={userLogs} />;
}
