import { createSlice } from '@reduxjs/toolkit';

import {
  fetchUrlMetaData,
  login,
  isUser,
  autoSignup,
  postDevlink,
  logout,
  fetchMyDevlinks,
  postMyDevlinkToPublic,
} from '../services/api';

import { fetchUrl } from '../services/chrome';

import { saveItem, removeItem } from '../services/storage/localStorage';

import { teches } from '../../assets/js/data';

const { actions, reducer } = createSlice({
  name: 'devlinky#',
  initialState: {
    error: null,
    currentUser: null,
    url: null,
    preview: null,
    comment: null,
    tags: [],
    autoCompleteTags: [],
    toggleSpeechBubble: false,
    // selectTabMenu: 'archive', // TODO : 아카이브 탭 작업 후 newlink로 변경 필요!
    selectTabMenu: 'newlink',
    isShowUrlValidationMessage: false,
    isShowTagsValidationMessage: false,
    isFullPageOverlay: false,
    mydevlinks: [],
    mydevlinksPerPage: [],
  },
  reducers: {
    setError(state, { payload: error }) {
      return {
        ...state,
        error,
      };
    },
    setMyDevlinksPerPage(state, { payload: mydevlinksPerPage }) {
      return {
        ...state,
        mydevlinksPerPage,
      };
    },
    setCurrentUser(state, { payload: currentUser }) {
      return {
        ...state,
        currentUser,
      };
    },
    resetCurrentUser(state) {
      return {
        ...state,
        currentUser: null,
      };
    },
    setSelectTabMenu(state, { payload: selectTabMenu }) {
      return {
        ...state,
        selectTabMenu,
      };
    },
    setUrl(state, { payload: url }) {
      return {
        ...state,
        url,
      };
    },
    setIsShowUrlValidationMessage(state, { payload: isShowUrlValidationMessage }) {
      return {
        ...state,
        isShowUrlValidationMessage,
      };
    },
    setPreview(state, { payload: preview }) {
      return {
        ...state,
        preview,
      };
    },
    setComment(state, { payload: comment }) {
      return {
        ...state,
        comment,
      };
    },
    setTags(state, { payload: tags }) {
      return {
        ...state,
        tags,
      };
    },
    setIsShowTagsValidationMessage(state, { payload: isShowTagsValidationMessage }) {
      return {
        ...state,
        isShowTagsValidationMessage,
      };
    },
    resetIsShowTagsValidationMessage(state) {
      return {
        ...state,
        isShowTagsValidationMessage: false,
      };
    },
    setAutoCompleteTags(state, { payload: autoCompleteTags }) {
      return {
        ...state,
        autoCompleteTags,
      };
    },
    resetAutoCompleteTags(state) {
      return {
        ...state,
        autoCompleteTags: [],
      };
    },
    setIsFullPageOverlay(state, { payload: isFullPageOverlay }) {
      return {
        ...state,
        isFullPageOverlay,
      };
    },
    resetDevlink(state) {
      return {
        ...state,
        url: null,
        preview: null,
        comment: null,
        tags: [],
      };
    },
    setMyDevlinks(state, { payload: mydevlinks }) {
      return {
        ...state,
        mydevlinks,
      };
    },
    settoggleSpeechBubble(state, { payload: toggleSpeechBubble }) {
      return {
        ...state,
        toggleSpeechBubble,
      };
    },
    resettoggleSpeechBubble(state) {
      return {
        ...state,
        toggleSpeechBubble: false,
      };
    },
  },
});

export const {
  setError,
  setCurrentUser,
  resetCurrentUser,
  setSelectTabMenu,
  setUrl,
  setIsShowUrlValidationMessage,
  setIsShowTagsValidationMessage,
  resetIsShowTagsValidationMessage,
  setPreview,
  setComment,
  setTags,
  setAutoCompleteTags,
  resetAutoCompleteTags,
  resetDevlink,
  setIsFullPageOverlay,
  setMyDevlinks,
  settoggleSpeechBubble,
  resettoggleSpeechBubble,
  setMyDevlinksPerPage,
} = actions;

export const loadCurrentUser = () => async (dispatch) => {
  try {
    const currentUser = await login();

    const user = {
      firebaseUid: currentUser.uid,
      githubId: currentUser.githubId,
      githubProfile: currentUser.githubProfile,
    };

    // eslint-disable-next-line no-unused-vars
    const response = await isUser(user.firebaseUid) || await autoSignup(user);

    saveItem('LAST_LOGIN_USER', JSON.stringify(currentUser));

    dispatch(setCurrentUser(currentUser));
  } catch (error) {
    dispatch(setError(error.message));
  }
};

export const removeCurrentUser = () => async (dispatch) => {
  removeItem('LAST_LOGIN_USER');

  await logout();

  dispatch(resetCurrentUser());
};

export const loadUrl = () => async (dispatch) => {
  const url = await fetchUrl();
  dispatch(setUrl(url));
};

export const fetchPreview = () => async (dispatch, getState) => {
  const { url } = getState();

  const { title, thumbnail, description } = await fetchUrlMetaData(url);

  dispatch(setPreview({
    url,
    title,
    description,
    thumbnail,
  }));
};

export const loadAutoCompleteTags = (newTag) => (dispatch) => {
  const autoCompleteTags = teches.filter((tech) => tech.name.toUpperCase().match(new RegExp(`^${newTag}`, 'i')));
  dispatch(setAutoCompleteTags(autoCompleteTags));
};

export const submitDevlink = () => async (dispatch, getState) => {
  const {
    currentUser, url, preview, comment, tags,
  } = getState();

  const devlink = {
    url,
    preview,
    comment,
    tags,
  };

  try {
    // eslint-disable-next-line no-unused-vars
    const response = await postDevlink({ userId: currentUser.uid, devlink });
    dispatch(setIsFullPageOverlay(false));
    dispatch(resetDevlink());
  } catch (error) { // TODO : 에러 메시지 처리 필요함
    dispatch(setError(error.message));
  }
};

export const removeTag = (removeIndex) => async (dispatch, getState) => {
  const { tags } = getState();

  const newTags = tags.filter((tag, index) => index !== removeIndex);

  dispatch(setTags(newTags));
};

export const loadMyDevlinks = () => async (dispatch, getState) => {
  const { currentUser } = getState();

  const myDevlinks = await fetchMyDevlinks(currentUser.uid);

  const newMyDevlinks = myDevlinks.map((myDevlink) => ({
    ...myDevlink,
    isShowCardHoverMenu: false,
  }));

  // dispatch(setMyDevlinks(newMyDevlinks));

  const itemPerPage = 4;
  const pageUnitCnt = 3;

  const myDevlinksCnt = myDevlinks.length;

  const share = parseInt(myDevlinksCnt / itemPerPage, 10);
  const rest = myDevlinksCnt % itemPerPage;

  const pageCnt = rest === 0 ? share : share + 1;

  const newMydevlinksPerPage = [];

  for (let i = 1; i <= pageCnt; i++) {
    const newmydevlinks = myDevlinks.filter((_, index) => index >= 4 * (i - 1) && index <= (4 * i) - 1);
    newMydevlinksPerPage.push(newmydevlinks);
  }

  console.log('newMydevlinksPerPage : ', newMydevlinksPerPage);

  dispatch(setMyDevlinksPerPage(newMydevlinksPerPage));

  dispatch(setMyDevlinks(newMydevlinksPerPage[0]));
};

export const showCardHoverMenu = (devlinkId) => (dispatch, getState) => {
  const { mydevlinks } = getState();

  const newMyDevlinks = mydevlinks.map((mydevlink) => (mydevlink?.id === devlinkId ? {
    ...mydevlink,
    isShowCardHoverMenu: !mydevlink.isShowCardHoverMenu,
  } : mydevlink));

  dispatch(setMyDevlinks(newMyDevlinks));
};

export const toggleCardPublicSetting = (mydevlinkId) => async (dispatch, getState) => {
  const { mydevlinks } = getState();

  const preMydevlink = mydevlinks.find(({ id }) => id === mydevlinkId);

  const newMyDevlinks = mydevlinks.map((mydevlink) => (mydevlink.id === mydevlinkId ? {
    ...mydevlink,
    isPublic: !mydevlink.isPublic,
  } : mydevlink));

  dispatch(setMyDevlinks(newMyDevlinks));

  try {
    await postMyDevlinkToPublic({ mydevlinkId, isPublic: !preMydevlink.isPublic });
  } catch (error) {
    dispatch(setMyDevlinks(mydevlinks));
    dispatch(setError(error.message));
  }
};

export default reducer;
