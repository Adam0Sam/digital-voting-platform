const UndefinedCallbackException = new Error('Callback is not defined');
export class DelayedFulfill {
  private timeoutId: NodeJS.Timeout | null = null;
  constructor(
    private timeoutDuration: number = 1000,
    private callback?: () => void | Promise<void>,
  ) {}

  setResolveCallback(callback: () => void | Promise<void>) {
    this.callback = callback;
  }

  beginResolve() {
    if (!this.callback) {
      throw UndefinedCallbackException;
    }
    if (this.timeoutId) {
      return;
    }
    this.timeoutId = setTimeout(() => {
      this.callback!();
      this.reset();
    }, this.timeoutDuration);
  }

  resolveNow() {
    this.reset();
    if (!this.callback) {
      throw UndefinedCallbackException;
    }
    this.callback();
  }

  reset() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }
}
