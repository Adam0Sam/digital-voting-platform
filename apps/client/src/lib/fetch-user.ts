import JWTController from './auth/jwt-controller';
import { User } from '@ambassador';
import { api } from './api';

export const fetchUser: (idToken?: string | null) => Promise<User> = async (
  idToken = JWTController.getItem(),
) => {
  if (!idToken) {
    throw new Error('No id_token found');
  }
  JWTController.setItem(idToken);
  const user = api.users.getOne();
  return user;
};
