export const get = (key) => (obj) => obj[key];

export const isEmpty = (a) => (Array.isArray(a) ? a.length === 0 : !a);
