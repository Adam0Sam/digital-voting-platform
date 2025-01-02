export const getPublicKey = async (endpoint: string): Promise<string> => {
  const response = await fetch(endpoint);
  const publicKey = await response.text();
  return publicKey;
};
