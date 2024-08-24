import { redirect } from 'react-router-dom';
import { getOAuth2Endpoint } from '../auth';

export function authLoader() {
  return redirect(getOAuth2Endpoint());
}

export const LOADER_ID = 'auth';
export type ReturnType = void;
