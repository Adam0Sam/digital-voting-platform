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
  // not sure why, but I cant access nested properties without defining these here
  'auth.jwt.publicKey'?: string;
  'auth.jwt.expiresIn'?: string;
  'auth.publicKeyEndpoint'?: string;
  'database.databaseUrl'?: string;
  'database.directUrl'?: string;
}
