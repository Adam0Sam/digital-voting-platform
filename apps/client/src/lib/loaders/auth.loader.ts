import { redirect } from 'react-router-dom';
import UserController from '../user-controller';
import { getOAuth2Endpoint } from '../auth';

export function authLoader() {
  UserController.removeItem();
  return redirect(getOAuth2Endpoint());
}

export const LOADER_ID = 'auth';
export type ReturnType = void;
