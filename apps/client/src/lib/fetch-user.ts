import { api } from './api';
import JWTController from './auth/jwt-controller';
import { User } from './types';

export const fetchUser: (idToken?: string | null) => Promise<User> = async (
  idToken = JWTController.getItem(),
) => {
  console.log('fetching user with ', idToken);
  if (!idToken) {
    throw new Error('No id_token found');
  }
  const user = await api.users.getOne(idToken);
  return user;
};
