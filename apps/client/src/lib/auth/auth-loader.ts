import { redirect } from 'react-router-dom';
import JWTController from './jwt-controller';
import UserController from '../user-controller';
import { api, APIError } from '../api';

export async function AuthLoader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const idToken = url.searchParams.get('id_token') || JWTController.getItem();
  if (!idToken) {
    console.error('No id_token found');
    return redirect('/signup');
  }

  try {
    const user = await api.users.getOne(idToken);
    window.history.replaceState({}, '', `${url.origin}${url.pathname}`);
    JWTController.setItem(idToken);
    UserController.setItem(user);
    return user;
  } catch (error) {
    JWTController.removeItem();
    UserController.removeItem();
    if (error instanceof APIError) {
      console.error(
        `APIError:\nmessage ${error.message}\nstatus ${error.status}`,
        error,
      );
      if (error.status === 401) {
        return redirect('/signup');
      }
    }
  }
}
