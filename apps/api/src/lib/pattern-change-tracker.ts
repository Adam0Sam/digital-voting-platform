export class PatternChangeTracker<T> {
  private additions: T[] = [];
  private removals: T[] = [];

  constructor() {}

  addAddition(value: T) {
    this.additions.push(value);
  }

  addRemoval(value: T) {
    this.removals.push(value);
  }

  getAdditions(): T[] | null {
    if (this.additions.length === 0) {
      return null;
    }
    return this.additions;
  }

  getRemovals(): T[] | null {
    if (this.removals.length === 0) {
      return null;
    }
    return this.removals;
  }
}
