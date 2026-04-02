const fallbackStorage = new Map<string, string>();

export function readStorageValue(storage: Storage, key: string): string | null {
    try {
        return storage.getItem(key);
    } catch {
        return fallbackStorage.get(key) ?? null;
    }
}

export function writeStorageValue(storage: Storage, key: string, value: string): void {
    try {
        storage.setItem(key, value);
        fallbackStorage.delete(key);
    } catch {
        fallbackStorage.set(key, value);
    }
}
