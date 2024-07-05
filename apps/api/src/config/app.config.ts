import { AppConfig } from './interfaces';
import { getFormattedAsymKey } from './key';
export default (): AppConfig => ({
  port: parseInt(process.env.PORT) || 3000,
  auth: {
    jwt: {
      // TODO: how to periodically fetch the publci key from the PUBLIC_KEY_ENDPOINT?
      publicKey: getFormattedAsymKey(process.env.PUBLIC_KEY),
      expiresIn: process.env.JWT_EXPIRES_IN,
    },
    publicKeyEndpoint: process.env.PUBLIC_KEY_ENDPOINT,
  },
  database: {
    databaseUrl: process.env.DATABASE_URL,
    directUrl: process.env.DIRECT_URL,
  },
});
