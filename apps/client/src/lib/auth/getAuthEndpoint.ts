import URI from '../constants/uri-constants';
export const CLIENT_ID = 'vp2024';
export function getOAuth2Endpoint() {
  return `${URI.OAUTH2_URL}?client_id=${CLIENT_ID}&redirect_uri=${URI.CLIENT}/signin`;
}
