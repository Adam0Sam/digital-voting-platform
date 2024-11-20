import { CreateUserDto, UserWithRelations } from '@ambassador';
import URI from '../constants/uri-constants';
import { HttpClient } from './http-client';

export class AdminApi {
  private readonly httpClient = new HttpClient(`${URI.SERVER_URL}/admin`);

  async getAllUsersDeep() {
    const allUsers = (await this.httpClient.get('all')) as UserWithRelations[];
    return allUsers;
  }

  async deactivateUser(userId: string) {
    return await this.httpClient.put(`${userId}/deactivate`);
  }

  async activateUser(userId: string) {
    return await this.httpClient.put(`${userId}/activate`);
  }

  async editUser(userId: string, user: CreateUserDto) {
    return await this.httpClient.put(`${userId}/edit`, { user });
  }

  async deleteUser(userId: string) {
    return await this.httpClient.delete(userId);
  }
}
