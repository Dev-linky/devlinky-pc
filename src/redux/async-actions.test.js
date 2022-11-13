import { getDefaultMiddleware } from '@reduxjs/toolkit';

import configureStore from 'redux-mock-store';

import {
  setError,
  loadUrl,
  setUrl,
  fetchPreview,
  setPreview,
  loadCurrentUser,
  setCurrentUser,
  loadAutoCompleteTags,
  setAutoCompleteTags,
  submitDevlink,
  resetDevlink,
  removeCurrentUser,
  resetCurrentUser,
  removeTag,
  setTags,
  setIsFullPageOverlay,
} from './slice';

import { fetchUrl } from '../services/chrome';

import {
  fetchUrlMetaData, login, isUser, autoSignup, postDevlink,
} from '../services/api';

import {
  error, url, preview, currentUser, autoCompleteTags, comment, tags,
} from '../../fixtures';

const mockStore = configureStore(getDefaultMiddleware());

jest.mock('../services/api');
jest.mock('../services/chrome');
jest.mock('../services/storage/localStorage');

describe('actions', () => {
  let store;

  describe('loadUrl', () => {
    beforeEach(() => {
      store = mockStore({
        url: null,
      });

      fetchUrl.mockResolvedValue(url);
    });

    it('runs setUrl', async () => {
      await store.dispatch(loadUrl());

      const actions = store.getActions();

      expect(actions[0]).toStrictEqual(setUrl(url));
    });
  });

  describe('fetchPreview', () => {
    beforeEach(() => {
      store = mockStore({
        url,
      });

      fetchUrlMetaData.mockResolvedValue(preview);
    });

    it('runs setPreview', async () => {
      await store.dispatch(fetchPreview());

      const actions = store.getActions();

      expect(actions[0]).toEqual(setPreview(preview));
    });
  });

  describe('loadCurrentUser', () => {
    context('when user is member', () => {
      beforeEach(() => {
        store = mockStore({
          currentUser: null,
        });

        login.mockResolvedValue(currentUser);

        isUser.mockResolvedValue({});
      });

      it('runs setCurrentUser and do not call autoSignup', async () => {
        await store.dispatch(loadCurrentUser());

        const actions = store.getActions();

        expect(autoSignup).toBeCalledTimes(0);

        expect(actions[0]).toStrictEqual(setCurrentUser(currentUser));
      });
    });

    context('when user is not member', () => {
      beforeEach(() => {
        store = mockStore({
          currentUser: null,
        });

        login.mockResolvedValue(currentUser);

        isUser.mockImplementation(() => undefined);
      });

      it('runs setCurrentUser and do call autoSignup', async () => {
        await store.dispatch(loadCurrentUser());

        const actions = store.getActions();

        expect(autoSignup).toBeCalledTimes(1);

        expect(actions[0]).toStrictEqual(setCurrentUser(currentUser));
      });
    });

    context('when error occurred', () => {
      beforeEach(() => {
        store = mockStore({
          currentUser: null,
        });

        const mockError = { message: error };
        login.mockRejectedValue(mockError);
        isUser.mockRejectedValue(mockError);
        autoSignup.mockRejectedValue(mockError);
      });

      it('runs setError', async () => {
        await store.dispatch(loadCurrentUser());

        const actions = store.getActions();

        expect(actions[0]).toEqual(setError('error'));
      });
    });
  });

  describe('loadAutoCompleteTags', () => {
    beforeEach(() => {
      store = mockStore({
        autoCompleteTags: [],
      });
    });

    it('runs setAutoCompleteTags', async () => {
      const inputTag = 'ja';

      await store.dispatch(loadAutoCompleteTags(inputTag));

      const actions = store.getActions();

      expect(actions[0]).toEqual(setAutoCompleteTags(autoCompleteTags));
    });
  });

  describe('submitDevlink', () => {
    context('when postDevlink is success', () => {
      beforeEach(() => {
        store = mockStore({
          currentUser,
          url,
          preview,
          comment,
          tags,
        });

        postDevlink.mockResolvedValue({});
      });

      it('runs resetDevlink', async () => {
        await store.dispatch(submitDevlink());

        const actions = store.getActions();

        expect(actions[0]).toEqual(setIsFullPageOverlay(false));
        expect(actions[1]).toEqual(resetDevlink());
      });
    });

    context('when postDevlink is not success', () => {
      beforeEach(() => {
        store = mockStore({
          currentUser,
          url,
          preview,
          comment,
          tags,
        });

        const mockError = { message: error };
        postDevlink.mockRejectedValue(mockError);
      });

      it('runs setError', async () => {
        await store.dispatch(submitDevlink());

        const actions = store.getActions();

        expect(actions[0]).toEqual(setError('error'));
      });
    });
  });

  describe('removeCurrentUser', () => {
    beforeEach(() => {
      store = mockStore({
        currentUser,
      });
    });

    it('runs resetCurrentUser', async () => {
      await store.dispatch(removeCurrentUser());

      const actions = store.getActions();

      expect(actions[0]).toStrictEqual(resetCurrentUser());
    });
  });

  describe('removeTag', () => {
    beforeEach(() => {
      store = mockStore({
        currentUser,
        tags,
      });
    });

    it('runs setTags', async () => {
      const removeIndex = 0;
      await store.dispatch(removeTag(removeIndex));

      const actions = store.getActions();

      expect(actions[0]).toStrictEqual(setTags([tags[1], tags[2]]));
    });
  });
});
