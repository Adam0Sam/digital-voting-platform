class StorageController<T> {
  constructor(
    private readonly storage: Storage,
    private readonly storageId: string,
  ) {}

  getItem() {
    const storedItem = this.storage.getItem(this.storageId);
    if (!storedItem) {
      return null;
    }
    return JSON.parse(storedItem) as T;
  }

  setItem(value: unknown) {
    this.storage.setItem(this.storageId, JSON.stringify(value));
  }

  removeItem() {
    this.storage.removeItem(this.storageId);
  }
}

export default StorageController;
