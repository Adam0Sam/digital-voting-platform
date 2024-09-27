import { UserActionLog } from '@/lib/types/log.type';
import { DataTable } from '../user/UserDataTable';
import { useRef } from 'react';

type LogTableProps = {
  logs: UserActionLog[];
};

export default function LogTable({ logs }: LogTableProps) {
  const uniqueUserAgents = useRef(
    Array.from(new Set(logs.map(log => log.userAgent))),
  );
  return (
    <div className="flex justify-center">
      <div className="min-w-0 max-w-screen-lg flex-1 px-0 py-10 sm:px-4"></div>
    </div>
  );
}
