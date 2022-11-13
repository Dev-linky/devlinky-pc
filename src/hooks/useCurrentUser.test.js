import { useDispatch, useSelector } from 'react-redux';

import useCurrentUser from './useCurrentUser';

import { currentUser } from '../../fixtures';

import { setCurrentUser } from '../redux/slice';

import { loadItem } from '../services/storage/localStorage';

jest.mock('react-redux');
jest.mock('../redux/slice');
jest.mock('../services/storage/localStorage');

describe('<useCurrentUser />', () => {
  context('with currentUser', () => {
    const dispatch = jest.fn();

    beforeEach(() => {
      useDispatch.mockImplementation(() => dispatch);

      useSelector.mockImplementation((selector) => selector({
        currentUser,
      }));
    });

    it('does not occure dispatch called setCurrentUser', () => {
      useCurrentUser();

      expect(dispatch).toBeCalledTimes(0);
    });
  });

  context('without currentUser && with LAST_LOGIN_USER in localStorage', () => {
    const dispatch = jest.fn();

    beforeEach(() => {
      useDispatch.mockImplementation(() => dispatch);

      loadItem.mockImplementation(() => (JSON.stringify({
        currentUser,
      })));

      useSelector.mockImplementation((selector) => selector({
        currentUser: null,
      }));
    });

    it('occures dispatch called setCurrentUser', () => {
      useCurrentUser();

      expect(dispatch).toBeCalledWith(setCurrentUser({
        currentUser,
      }));
    });
  });
});
