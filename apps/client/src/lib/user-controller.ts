import { User } from '@/lib/types';
import StorageController from './storage-controller';

const UserController = new StorageController<User>(localStorage, 'user');
export default UserController;
