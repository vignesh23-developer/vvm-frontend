const getLocalStorageItem = async (key: string): Promise<string | null> => {
    if (typeof window === 'undefined') {
        return null;
    }
    return localStorage.getItem(key);
};

const setLocalStorageItem = async (key: string, value: string): Promise<void> => {
    if (typeof window === 'undefined') {
        return;
    }
    localStorage.setItem(key, value);
};

const removeLocalStorageItem = async (key: string): Promise<void> => {
    if (typeof window === 'undefined') {
        return;
    }
    localStorage.removeItem(key);
};

export { getLocalStorageItem, setLocalStorageItem, removeLocalStorageItem };

