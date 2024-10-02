import { api } from '../api';
import { getUserQueryId } from '../routes/admin.routes';

export async function externalUserInfoLoader({
  request,
}: {
  request: Request;
}) {
  const userId = getUserQueryId(new URL(request.url));
  return await api.admin.getUserInfo(userId);
}
