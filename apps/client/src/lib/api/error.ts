export class APIError extends Error {
  constructor(
    public message: string,
    public status?: number,
  ) {
    super(message);
    this.status = status ?? 500;
    this.name = 'APIError';
  }
}
