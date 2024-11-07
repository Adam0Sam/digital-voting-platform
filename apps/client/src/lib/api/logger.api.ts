import URI from '../constants/uri-constants';
import { HttpClient } from './http-client';

export class LoggerApi {
  private readonly httpClient = new HttpClient(`${URI.SERVER_URL}/logs`);

  async registerSignin() {
    return await this.httpClient.post('signin');
  }
}
