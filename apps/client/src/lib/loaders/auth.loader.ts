import { redirect } from 'react-router-dom';
import URI from '../constants/uri-constants';
import { AUTH_PATHS } from '../routes';
const CLIENT_ID = 'ia';
const REDIRECT_URL = `${URI.OAUTH2_URL}?client_id=${CLIENT_ID}&redirect_uri=${URI.CLIENT}/${AUTH_PATHS.SIGNIN}`;
export function authLoader() {
  return redirect(REDIRECT_URL);
}
