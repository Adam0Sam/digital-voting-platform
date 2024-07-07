import { redirect } from 'react-router-dom';
import { fetchUser } from './fetch-responses';
import { User } from '../../interfaces';

export async function AuthLoader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const idToken =
    url.searchParams.get('id_token') || localStorage.getItem('id_token');
  if (!idToken) {
    return redirect('/signup');
  }
  console.log('fetching...');
  const response = await fetchUser(idToken);
  console.log('fetched');
  if (!response.ok) {
    localStorage.removeItem('id_token');
    return redirect('/signup');
  }
  const user: User = await response.json();
  window.history.replaceState({}, '', `${url.origin}${url.pathname}`);
  localStorage.setItem('id_token', idToken);
  return user;
}
