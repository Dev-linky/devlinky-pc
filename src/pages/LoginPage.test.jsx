import React from 'react';

import { useDispatch } from 'react-redux';

import { fireEvent, render } from '@testing-library/react';

import { useHistory } from 'react-router-dom';

import LoginPage from './LoginPage';

import useCurrentUser from '../hooks/useCurrentUser';

import { currentUser } from '../../fixtures';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: jest.fn(),
}));

jest.mock('../hooks/useCurrentUser');

describe('<LoginPage />', () => {
  context('without currentUser', () => {
    beforeEach(() => {
      useCurrentUser.mockImplementation(() => ({
        currentUser: null,
      }));
    });

    it('shows login button', () => {
      const { container } = render(<LoginPage />);

      expect(container).toHaveTextContent('login');
    });
  });

  context('without currentUser && with "?code=X"', () => {
    const dispatch = jest.fn();

    beforeEach(() => {
      useCurrentUser.mockImplementation(() => ({
        currentUser: null,
      }));

      useDispatch.mockImplementation(() => dispatch);

      delete window.location;

      window.location = {
        search: '?code=xyx',
      };
    });

    it('dispatch loadCurrentUser', () => {
      render(<LoginPage />);

      expect(dispatch).toBeCalledTimes(1);
    });
  });

  context('when user click login button', () => {
    beforeEach(() => {
      useCurrentUser.mockImplementation(() => ({
        currentUser: null,
      }));

      delete window.location;

      window.location = {
        assign: jest.fn(),
      };
    });

    it('change currentUser', () => {
      const { getByText } = render(<LoginPage />);

      fireEvent.click(getByText('Github login'));

      expect(window.location.assign).toBeCalledTimes(1);
    });
  });

  context('with currentUser', () => {
    const mockPush = jest.fn();

    beforeEach(() => {
      useCurrentUser.mockImplementation(() => ({
        currentUser,
      }));

      useHistory.mockImplementation(() => ({
        push: mockPush,
      }));
    });

    it('shows mainPage', () => {
      render(<LoginPage />);

      expect(mockPush).toBeCalledWith('/');
    });
  });
});
