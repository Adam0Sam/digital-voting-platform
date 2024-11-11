import { api } from '../api';

function getUserQueryId(url: URL) {
  const pathname = url.pathname.split('/');
  return pathname[pathname.length - 2];
}

export async function userLogsLoader({ request }: { request: Request }) {
  const userId = getUserQueryId(new URL(request.url));
  return await api.admin.getUserLogs(userId);
}
