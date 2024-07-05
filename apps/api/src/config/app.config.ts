import { AppConfig } from './interfaces';

export default (): AppConfig => ({
  port: parseInt(process.env.PORT) || 3000,
  auth: {
    jwt: {
      // temporary solution
      publicKey: process.env.JWT_PUBLIC_KEY,
      expiresIn: process.env.JWT_EXPIRES_IN,
    },
    publicKeyEndpoint: process.env.PUBLIC_KEY_ENDPOINT,
  },
  database: {
    databaseUrl: process.env.DATABASE_URL,
    directUrl: process.env.DIRECT_URL,
  },
});
