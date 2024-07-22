import { redirect } from 'react-router-dom';
import { User } from '../../types';
import { JWTController } from './jwt-controller';
import { userApi } from '../api';

export async function AuthLoader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const idToken = url.searchParams.get('id_token') || JWTController.getToken();
  if (!idToken) {
    return redirect('/signup');
  }
  const response = await userApi.getOne(idToken);
  if (!response.ok) {
    localStorage.removeItem('id_token');
    return redirect('/signup');
  }
  const user: User = await response.json();
  window.history.replaceState({}, '', `${url.origin}${url.pathname}`);
  JWTController.setToken(idToken);
  return user;
}
