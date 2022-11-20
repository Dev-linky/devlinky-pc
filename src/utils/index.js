export const get = (key) => (obj) => obj[key];

export const isEmpty = (a) => (Array.isArray(a) ? a.length === 0 : !a);

export const optimizeUpdator = (request, expect, errorCatch, rollback) => {
  setTimeout(async () => {
    try {
      await request();
    } catch (error) {
      rollback();
      errorCatch(error);
    }
  }, 0);

  expect();
};
