import { fetchUser } from '../fetch-user';

export async function userLoader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const idToken = url.searchParams.get('id_token');
  const user = await fetchUser(idToken);
  window.history.replaceState({}, '', `${url.origin}${url.pathname}`);
  return user;
}
