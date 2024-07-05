export interface AppConfig {
  port: number;
  auth: {
    jwt: {
      publicKey: string;
      expiresIn: string;
    };
    publicKeyEndpoint: string;
  };
  database: {
    databaseUrl: string;
    directUrl: string;
  };
  'auth.jwt.expiresIn'?: string;
  'auth.jwt.publicKey'?: string;
}
