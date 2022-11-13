import {
  githubOAuthLogin,
  getUser,
  addUser,
  getDevlink,
  addNewDevlink,
  addMyDevlink,
  githubOAuthLogout,
} from '../firebase';

export const fetchUrlMetaData = async (url) => {
  const response = await fetch(url, {
    method: 'GET',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
  });

  const html = await response.text();

  const el = document.createElement('div');
  el.innerHTML = html;

  const title = el.querySelector('meta[property="og:title"]')?.getAttribute('content') || '제목이 없습니다';
  const description = el.querySelector('meta[property="og:description"]')?.getAttribute('content') || '설명이 없습니다';
  const thumbnail = el.querySelector('meta[property="og:image"]')?.getAttribute('content') || '../../assets/images/img_extension_default.png';

  const preview = {
    url,
    title,
    description,
    thumbnail,
  };

  return preview;
};

export const isUser = async (firebaseUid) => {
  const response = await getUser(firebaseUid);
  return response;
};

export const autoSignup = async (user) => {
  const response = await addUser(user);
  return response;
};

export const login = async () => {
  const response = await githubOAuthLogin();

  const firebaseUserIdToken = await response.user.getIdToken(true);

  const currentUser = {
    uid: response.user.uid,
    githubId: response.additionalUserInfo.profile.login,
    githubProfile: response.user.photoURL,
    accessToken: {
      github: response.credential.accessToken,
      firebase: firebaseUserIdToken,
    },
  };

  return currentUser;
};

export const postDevlink = async ({ userId, devlink }) => {
  const response = await getDevlink({ url: devlink.url }) || await addNewDevlink(devlink);

  const result = await addMyDevlink({ userId, devlinkId: response?.uid });
  return result;
};

export const logout = async () => {
  await githubOAuthLogout();
};
