import URI from '../constants/uri-constants';

// export function getSessionToken(idToken: string) {
//   const response = fetch(`${URI.API}/auth/signin`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       authentication: idToken,
//     },
//   });
//   console.log(response);
// }

export function fetchUser(id_token: string) {
  return fetch(`${URI.API}/user`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${id_token}`,
    },
  });
}
