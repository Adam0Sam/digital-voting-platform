export class DelayedFulfill {
  private timeoutId: NodeJS.Timeout | null = null;
  constructor(
    private callback: () => void | Promise<void>,
    private timeoutDuration: number = 1000,
  ) {}

  beginResolve() {
    console.log('beginResolve');
    this.timeoutId = setTimeout(() => {
      this.callback();
      console.log('callback');
    }, this.timeoutDuration);
  }

  reject() {
    if (this.timeoutId) {
      console.log('reject');
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }
}
