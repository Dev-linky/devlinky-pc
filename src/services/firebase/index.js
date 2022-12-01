import firebase from 'firebase/app';

import 'firebase/auth';
import 'firebase/firestore';

import config from './config';

firebase.initializeApp(config);

const githubAuthProvider = new firebase.auth.GithubAuthProvider();
const githubOAuthLogin = () => firebase.auth().signInWithPopup(githubAuthProvider);
const githubOAuthLogout = () => firebase.auth().signOut();

const db = firebase.firestore();

const version = 'V2';

const getUser = async (firebaseUid) => {
  const responses = await db.collection('user').where('uid', '==', firebaseUid).get();

  return responses.docs.map((doc) => (doc.data()))[0];
};

const addUser = async ({ firebaseUid, githubId, githubProfile }) => {
  await db.collection('user').doc(firebaseUid).set({
    githubId,
    githubProfile,
  });

  return { uid: firebaseUid, githubId, githubProfile };
};

const getDevlink = async ({ url }) => {
  const responses = await db.collection(`devlink${version}`).where('url', '==', url).get();

  return responses.docs.map((doc) => ({
    uid: doc.id,
    ...doc.data(),
  }))[0];
};

const getDevlinkById = async (devlinkId) => {
  const result = await db.collection(`devlink${version}`).doc(devlinkId).get();
  return {
    id: devlinkId,
    ...result.data(),
  };
};

const getDevlinksByIds = async (devlinkIds) => {
  const devlinks = devlinkIds.map(async (devlinkId) => {
    const devlink = await getDevlinkById(devlinkId);
    return devlink;
  });

  const result = await Promise.all(devlinks);

  return result;
};

const getMyDevlinks = async (userUid) => {
  const itemCntPerPage = 4; // 1페이지당 불러오는 카드 수
  const pageCntPerRequest = 3; // 1번에 볼 수 있는 페이지 수

  const maxItemOnce = itemCntPerPage * pageCntPerRequest + 1;

  const responses = await db.collection(`mydevlink${version}`)
    .orderBy('createdAt', 'desc').limit(maxItemOnce)
    .where('userUid', '==', userUid)
    .get();

  const myDevlinks = responses.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return myDevlinks;
};

const addNewDevlink = async (devlink) => {
  const newDevlink = {
    ...devlink,
    createdAt: new Date().toISOString(),
    updatedAt: null,
    deletedAt: null,
  };

  const doc = await db.collection(`devlink${version}`).add(newDevlink);

  const resNewDevLink = newDevlink;
  resNewDevLink.uid = doc.id;

  return resNewDevLink;
};

const addMyDevlink = async ({ userId, devlinkId }) => {
  const newMyDevlink = {
    userUid: userId,
    devlinkId,
    createdAt: new Date().toISOString(),
    updatedAt: null,
    deletedAt: null,
  };

  console.log('newMyDevlink : ', newMyDevlink);

  const doc = await db.collection(`mydevlink${version}`).add(newMyDevlink);

  return doc;
};

const addMyDevlinkToPublic = async ({ mydevlinkId, isPublic }) => {
  const result = await db.collection(`mydevlink${version}`).doc(mydevlinkId).update({
    isPublic,
  });

  return result;
};

export {
  firebase,
  githubAuthProvider,
  githubOAuthLogin,
  getUser,
  addUser,
  getDevlink,
  addNewDevlink,
  addMyDevlink,
  githubOAuthLogout,
  getMyDevlinks,
  getDevlinksByIds,
  getDevlinkById,
  addMyDevlinkToPublic,
};
