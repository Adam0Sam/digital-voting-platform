import { fetchUser } from '../fetch-user';
import { User } from '../types';

export async function userLoader({
  request,
}: {
  request: Request;
}): Promise<ReturnType | Response> {
  const url = new URL(request.url);
  const idToken = url.searchParams.get('id_token');
  const user = await fetchUser(idToken);
  window.history.replaceState({}, '', `${url.origin}${url.pathname}`);
  return user;
}

export const LOADER_ID = 'user';

export type ReturnType = User;
