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

export const getUrlFromBodyHTML = (bodyHTML) => {
  const el = document.createElement('div');
  el.innerHTML = bodyHTML;

  const aTags = el.querySelectorAll('a');
  const url = aTags[0].href;

  return url;
};

export const getThumbnailUrlFromBodyHTML = (bodyHTML) => {
  const el = document.createElement('div');
  el.innerHTML = bodyHTML;

  const aTags = el.querySelectorAll('a');

  const thumbnailUrl = aTags[1].href;

  return thumbnailUrl;
};
