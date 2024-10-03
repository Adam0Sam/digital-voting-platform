import { api } from '../api';
import { getUserQueryId } from '../routes/admin.routes';

export async function userLogsLoader({ request }: { request: Request }) {
  const userId = getUserQueryId(new URL(request.url));
  return await api.admin.getUserLogs(userId);
}
