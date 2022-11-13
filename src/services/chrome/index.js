/* global chrome */
export const fetchUrl = () => new Promise((resolve) => {
  if (process.env.NODE_ENV === 'production') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      resolve(tabs[0].url);
    });
  } else {
    const currentTabUrl = 'https://jeonghwan-kim.github.io/series/2019/12/10/frontend-dev-env-webpack-basic.html';
    setTimeout(() => {
      resolve(currentTabUrl);
    }, 1000);
  }
});

export const temp = () => {};
