import { createSlice } from '@reduxjs/toolkit';

import {
  fetchUrlMetaData, login, isUser, autoSignup, postDevlink, logout,
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
    selectTabMenu: 'newlink',
    isShowUrlValidationMessage: false,
    isShowTagsValidationMessage: false,
    isFullPageOverlay: false,
  },
  reducers: {
    setError(state, { payload: error }) {
      return {
        ...state,
        error,
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
  settoggleSpeechBubble,
  resettoggleSpeechBubble,
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

export default reducer;
