import { redirect } from 'react-router-dom';
import { User } from '../../types';
import JWTController from './jwt-controller';
import { UserApi } from '../api';
import UserController from '../user-controller';

export async function AuthLoader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const idToken = url.searchParams.get('id_token') || JWTController.getItem();
  if (!idToken) {
    console.error('No id_token found');
    return redirect('/signup');
  }
  const response = await UserApi.getOne(idToken);
  if (!response.ok) {
    JWTController.removeItem();
    return redirect('/signup');
  }
  const user: User = await response.json();
  window.history.replaceState({}, '', `${url.origin}${url.pathname}`);
  JWTController.setItem(idToken);
  UserController.setItem(user);
  return user;
}
