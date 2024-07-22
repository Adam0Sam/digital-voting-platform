import URI from '../constants/uri-constants';
const CLIENT_ID = 'vp2024';
export default function getAuthEndpoint() {
  return `${URI.IDENTITY_SERVICE_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${URI.CLIENT}/signin`;
}
