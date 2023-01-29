import { createSlice } from '@reduxjs/toolkit';

import {
  fetchUrlMetaData,
  login,
  isUser,
  autoSignup,
  postDevlink,
  logout,
  fetchDevlinks,
  fetchMyDevlinks,
  postMyDevlinkToPublic,
} from '../services/api';

import { fetchUrl } from '../services/chrome';

import {
  saveItem,
  removeItem,
  loadItem,
} from '../services/storage/localStorage';

import { teches } from '../../assets/js/data';

import { getIssues } from '../services/github';

import { getUrlFromBodyHTML, getThumbnailUrlFromBodyHTML } from '../utils';

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
    selectTabMenu: 'archive', // TODO : 아카이브 탭 작업 후 newlink로 변경 필요!
    // selectTabMenu: 'newlink',
    isShowUrlValidationMessage: false,
    isShowTagsValidationMessage: false,
    isFullPageOverlay: false,
    mydevlinks: [],
    mydevlinksAll: [],
    mydevlinksPerPage: [],
  },
  reducers: {
    setError(state, { payload: error }) {
      return {
        ...state,
        error,
      };
    },
    setMyDevlinksAll(state, { payload: mydevlinksAll }) {
      return {
        ...state,
        mydevlinksAll,
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
    setIsShowUrlValidationMessage(
      state,
      { payload: isShowUrlValidationMessage }
    ) {
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
    setIsShowTagsValidationMessage(
      state,
      { payload: isShowTagsValidationMessage }
    ) {
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
  setMyDevlinksAll,
} = actions;

export const loadCurrentUser = (codeParam) => async (dispatch) => {
  try {
    const currentUser = await login(codeParam);

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

  dispatch(
    setPreview({
      url,
      title,
      description,
      thumbnail,
    })
  );
};

export const loadAutoCompleteTags = (newTag) => (dispatch) => {
  const autoCompleteTags = teches.filter((tech) =>
    tech.name.toUpperCase().match(new RegExp(`^${newTag}`, 'i'))
  );
  dispatch(setAutoCompleteTags(autoCompleteTags));
};

export const submitDevlink = () => async (dispatch, getState) => {
  const { currentUser, url, preview, comment, tags } = getState();

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
  } catch (error) {
    // TODO : 에러 메시지 처리 필요함
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

  const { accessToken } = JSON.parse(loadItem('LAST_LOGIN_USER'));

  // const temp = {
  //   repository: {
  //     issues: {
  //       totalCount: 19,
  //       edges: [
  //         {
  //           cursor: 'Y3Vyc29yOnYyOpHOV1LAhg==',
  //           node: {
  //             bodyText:
  //               'URL\n\nhttps://jeonghwan-kim.github.io/series/2019/12/10/frontend-dev-env-webpack-basic.html\n\nThumbnal Image\n\nhttps://raw.githubusercontent.com/daadaadaah/devlinky-test-repo/main/1673160967160.jpeg',
  //             labels: {
  //               edges: [
  //                 {
  //                   node: {
  //                     id: 'LA_kwDOGHdamM7KELKE',
  //                     name: 'good first issue',
  //                   },
  //                 },
  //                 {
  //                   node: {
  //                     id: 'LA_kwDOGHdamM7KELKG',
  //                     name: 'invalid',
  //                   },
  //                 },
  //               ],
  //             },
  //             title: 'create Test 10',
  //           },
  //         },
  //       ],
  //     },
  //   },
  // };

  const response = await fetchDevlinks({ accessToken, beforeLastCursor: null });

  const { edges, totalCount } = response.repository.issues;

  const mydevlinks = edges.map((edge) => ({
    id: edge.cursor,
    comment: edge.node.title,
    url: getUrlFromBodyHTML(edge.node.bodyHTML),
    thumbnailUrl: getThumbnailUrlFromBodyHTML(edge.node.bodyHTML),
    tags: edge.node.labels.edges.map((label) => label.node.name),
  }));

  dispatch(setMyDevlinks(mydevlinks));

  console.log('mydevlinks : ', mydevlinks);

  // 1, 2, 3, 4, 마지막 커서
  // 5, 6, 7, 8, 마지막 커서

  // const pages = mydevlinks
  //   .filter((node, idx) => (idx + 1) % 3 === 0)
  //   .map((item, idx) => ({
  //     beforeLastCursor: item.id,
  //     datas: mydevlinks.filter((_, index) => index < idx + 3),
  //   }));
  // console.log('pages', pages);

  // page: {
  //   Number,
  //   beforeLastCursor: 19,
  //   data: [{}, {}, {}],
  // }

  // 1 : pages[0].beforeLastCursor
  // 2 : pages[1].beforeLastCursor
  // 3 : pages[2].beforeLastCursor
  // > :

  // const isBeforePage = page.number !==1 && totalCount % 3 === 1;
  // const isNextPage = totalCount % 3 === 0;

  // TODO : 1, 2, 3 만들어주는 로직 추가
  // page: {
  //   number:
  //   beforeLastCursor:
  // }

  // const myDevlink = {
  //   id: edge,
  //   title:,
  //   url:,
  //   thumbnailUrl:,
  //   tags:,
  // };

  // const newMyDevlinks = edges.map((myDevlink) => ({
  //   id: myDevlink.cursor,
  //   devlink: {
  //     firstDevlinkerUid: myDevlink.cursor,
  //     comment: myDevlink.node.bodyText,
  //   },
  //   isShowCardHoverMenu: false,
  // }));
  // console.log('newMyDevLinks', newMyDevlinks);
  // // dispatch(setMyDevlinks(newMyDevlinks));

  // const itemPerPage = 4;
  // const pageUnitCnt = 3;

  // const myDevlinksCnt = myDevlinks.length;

  // const share = parseInt(myDevlinksCnt / itemPerPage, 10);
  // const rest = myDevlinksCnt % itemPerPage;

  // const pageCnt = rest === 0 ? share : share + 1;

  // const newMydevlinksPerPage = [];

  // for (let i = 1; i <= pageCnt; i++) {
  //   const newmydevlinks = myDevlinks.filter(
  //     (_, index) =>
  //       index >= itemPerPage * (i - 1) && index <= itemPerPage * i - 1
  //   );
  //   newMydevlinksPerPage.push(newmydevlinks);
  // }

  // console.log('newMydevlinksPerPage : ', newMydevlinksPerPage);

  // dispatch(setMyDevlinksPerPage(newMyDevlinks));
  // dispatch(setMyDevlinksAll(newMyDevlinks));
  // dispatch(setMyDevlinks(newMyDevlinks));
};

// 3개 * 3
// 1, 2, 3, >
// <, 4, 5, 6, >

// 10개
// 1, 2(1번 마지막 커서), 3(2번 마지막 커서), >

// 초기
// last: 9

// 1 페이지 : 커서19, 커서18, 커서17
// 2 페이지 : 커서16, 커서15, 커서14 -> 커서17의 id
// 3 페이지 : 커서13, 커서12, 커서11
// 4 페이지 : 커서10, 커서9, 커서8

export const loadMyDevlinksPerPage = (beforeLastCursor) => async (dispatch) => {
  const { accessToken } = JSON.parse(loadItem('LAST_LOGIN_USER'));

  const response = await fetchDevlinks({ accessToken, beforeLastCursor });

  const { edges, totalCount } = response.repository.issues;

  // const temp = {
  //   repository: {
  //     issues: {
  //       totalCount: 19,
  //       edges: [
  //         {
  //           cursor: 'Y3Vyc29yOnYyOpHOV1LAhg==',
  //           node: {
  //             bodyText:
  //               'URL\n\nhttps://jeonghwan-kim.github.io/series/2019/12/10/frontend-dev-env-webpack-basic.html\n\nThumbnal Image\n\nhttps://raw.githubusercontent.com/daadaadaah/devlinky-test-repo/main/1673160967160.jpeg',
  //             labels: {
  //               edges: [
  //                 {
  //                   node: {
  //                     id: 'LA_kwDOGHdamM7KELKE',
  //                     name: 'good first issue',
  //                   },
  //                 },
  //                 {
  //                   node: {
  //                     id: 'LA_kwDOGHdamM7KELKG',
  //                     name: 'invalid',
  //                   },
  //                 },
  //               ],
  //             },
  //             title: 'create Test 10',
  //           },
  //         },
  //       ],
  //     },
  //   },
  // };
  const mydevlinks = edges.map((edge) => ({
    id: edge.cursor,
    comment: edge.node.title,
    url: getUrlFromBodyHTML(edge.node.bodyHTML),
    thumbnailUrl: getThumbnailUrlFromBodyHTML(edge.node.bodyHTML),
    tags: edge.node.labels.edges.map((label) => label.node.name),
  }));

  dispatch(setMyDevlinks(mydevlinks));

  console.log('mydevlinks : ', mydevlinks);
};

export const showCardHoverMenu = (devlinkId) => (dispatch, getState) => {
  const { mydevlinks } = getState();

  const newMyDevlinks = mydevlinks.map((mydevlink) =>
    mydevlink?.id === devlinkId
      ? {
          ...mydevlink,
          isShowCardHoverMenu: !mydevlink.isShowCardHoverMenu,
        }
      : mydevlink
  );

  dispatch(setMyDevlinks(newMyDevlinks));
};

export const toggleCardPublicSetting =
  (mydevlinkId) => async (dispatch, getState) => {
    const { mydevlinks } = getState();

    const preMydevlink = mydevlinks.find(({ id }) => id === mydevlinkId);

    const newMyDevlinks = mydevlinks.map((mydevlink) =>
      mydevlink.id === mydevlinkId
        ? {
            ...mydevlink,
            isPublic: !mydevlink.isPublic,
          }
        : mydevlink
    );

    dispatch(setMyDevlinks(newMyDevlinks));

    try {
      await postMyDevlinkToPublic({
        mydevlinkId,
        isPublic: !preMydevlink.isPublic,
      });
    } catch (error) {
      dispatch(setMyDevlinks(mydevlinks));
      dispatch(setError(error.message));
    }
  };

export default reducer;
