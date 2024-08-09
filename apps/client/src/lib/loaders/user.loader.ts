import { redirect } from 'react-router-dom';

import { api } from '../api';
import { User } from '../types';
import JWTController from '../auth/jwt-controller';

export async function userLoader({
  request,
}: {
  request: Request;
}): Promise<ReturnType | Response> {
  const url = new URL(request.url);
  const idToken = url.searchParams.get('id_token') || JWTController.getItem();
  if (!idToken) {
    console.error('No id_token found');
    return redirect('/signup');
  }
  const user = await api.users.getOne(idToken);
  window.history.replaceState({}, '', `${url.origin}${url.pathname}`);
  return { user, idToken };
}

export const LOADER_ID = 'user';

export type ReturnType = { user: User; idToken: string };
