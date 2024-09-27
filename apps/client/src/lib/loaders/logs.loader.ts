import { api } from '../api';
import { User } from '../types';
import { UserActionLog } from '../types/log.type';

export async function userLogsLoader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const pathname = url.pathname.split('/');
  const userId = pathname[pathname.length - 2];
  const data: ReturnType = await api.admin.getUserLogs(userId);
  console.log('DATA', data);
  return data;
}

export const LOADER_ID = 'user-logs';
export type ReturnType = User & { actionLogs: UserActionLog[] };
