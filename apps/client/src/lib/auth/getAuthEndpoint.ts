import URI from '../constants/uri-constants';
const CLIENT_ID = 'vp2024';
export default function getAuthEndpoint() {
  return `${URI.OAUTH2_URL}?client_id=${CLIENT_ID}&redirect_uri=${URI.CLIENT}/signin`;
}
