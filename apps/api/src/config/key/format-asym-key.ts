export function getFormattedAsymKey(key: string): string {
  return key.replace(
    /-----BEGIN PUBLIC KEY-----|-----END PUBLIC KEY-----|\s+/g,
    (match) => {
      if (
        match === '-----BEGIN PUBLIC KEY-----' ||
        match === '-----END PUBLIC KEY-----'
      ) {
        return match;
      } else {
        return '\n';
      }
    },
  );
}
