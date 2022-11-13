export const saveItem = (key, value) => localStorage.setItem(key, value);

export const loadItem = (key) => localStorage.getItem(key);

export const removeItem = (key) => localStorage.removeItem(key);
