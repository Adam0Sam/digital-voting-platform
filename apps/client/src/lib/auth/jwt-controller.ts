import StorageController from '../storage-controller';

const JWTController = new StorageController<string>(localStorage, 'id_token');

export default JWTController;
