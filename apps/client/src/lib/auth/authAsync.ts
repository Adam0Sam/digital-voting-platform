import URI from '../constants/uri-constants';

export function getSessionToken(idToken: string) {
  const response = fetch(`${URI.API}/auth/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      authentication: idToken,
    },
  });
  console.log(response);
}
