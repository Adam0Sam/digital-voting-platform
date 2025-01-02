import { redirect } from 'react-router-dom';
import URI from '../constants/uri-constants';
import { AUTH_PATHS } from '../routes';
import { api } from '../api';
import { fetchUser } from '../fetch-user';

export function authLoader() {
  const CLIENT_ID = 'ia';
  const REDIRECT_URL = `${URI.OAUTH2_URL}?client_id=${CLIENT_ID}&redirect_uri=${URI.CLIENT}/${AUTH_PATHS.SIGNIN}`;
  return redirect(REDIRECT_URL);
}

function getUserQueryId(url: URL) {
  const pathname = url.pathname.split('/');
  return pathname[pathname.length - 2];
}

export async function userLogsLoader({ request }: { request: Request }) {
  const userId = getUserQueryId(new URL(request.url));
  return await api.logs.getUserLogs(userId);
}

export async function managerProposalsLoader() {
  return await api.proposals.getAllManagerProposals();
}

export async function managerRolesLoader() {
  return await api.managerRole.getAuthoredRoles();
}

export async function userDeepInfoLoader() {
  return await api.admin.getAllUsersDeep();
}

export async function userLoader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const idToken = url.searchParams.get('id_token');
  const user = await fetchUser(idToken);
  window.history.replaceState({}, '', `${url.origin}${url.pathname}`);
  return user;
}

export async function voterProposalsLoader() {
  return await api.proposals.getAllVoterProposals();
}

export async function unreadNotificationCountLoader() {
  return await api.notification.getUnreadNotificationCount();
}

export async function notificationsLoader() {
  return await api.notification.getNotifications();
}
