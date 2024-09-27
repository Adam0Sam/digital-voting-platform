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
    if (this.timeoutId) {
      return;
    }
    if (!this.callback) {
      return;
    }
    this.timeoutId = setTimeout(() => {
      this.callback!();
      console.log('callback');
    }, this.timeoutDuration);
  }

  immediateResolve() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    if (!this.callback) {
      return;
    }
    this.callback();
  }

  reject() {
    if (this.timeoutId) {
      console.log('reject');
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }
}
