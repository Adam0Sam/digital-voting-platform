export class JWTController {
  private static localStorageTokenId = 'id_token' as const;

  static getToken() {
    return localStorage.getItem(this.localStorageTokenId);
  }

  static setToken(id_token: string) {
    localStorage.setItem(this.localStorageTokenId, id_token);
  }

  static removeToken() {
    localStorage.removeItem(this.localStorageTokenId);
  }
}
