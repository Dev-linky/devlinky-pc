import React from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { screen, render, fireEvent } from '@testing-library/react';

import useCurrentUser from './hooks/useCurrentUser';

import { settoggleSpeechBubble, resettoggleSpeechBubble } from './redux/slice';

import { currentUser, toggleSpeechBubble } from '../fixtures';

import Header from './Header';

jest.mock('./hooks/useCurrentUser');
jest.mock('react-redux');

describe('<Header />', () => {
  context('inital render', () => {
    useCurrentUser.mockImplementation(() => ({
      currentUser: null,
    }));

    it('shows logo', () => {
      render(<Header />);
      const logo = screen.getByAltText('devlinky-logo');
      expect(logo).toHaveAttribute('src', '../assets/images/logo-small.png');
    });
  });

  context('with currentUser', () => {
    useCurrentUser.mockImplementation(() => ({
      currentUser,
    }));

    it('shows user profile', () => {
      render(<Header />);

      const userProfile = screen.getByAltText('user-profile');

      expect(userProfile).toHaveAttribute('src', currentUser.githubProfile);
    });
  });

  context('when user click user profile', () => {
    const dispatch = jest.fn();

    beforeEach(() => {
      useCurrentUser.mockImplementation(() => ({
        currentUser,
      }));

      useDispatch.mockImplementation(() => dispatch);

      useSelector.mockImplementation((selector) => selector({
        toggleSpeechBubble: false,
      }));
    });

    it('change toggleSpeechBubble', () => {
      const { getByAltText } = render(<Header />);

      fireEvent.click(getByAltText('user-profile'));

      expect(dispatch).toBeCalledWith(settoggleSpeechBubble(true));
    });
  });

  context('when user click logout button', () => {
    const dispatch = jest.fn();

    beforeEach(() => {
      useCurrentUser.mockImplementation(() => ({
        currentUser,
      }));

      useDispatch.mockImplementation(() => dispatch);

      useSelector.mockImplementation((selector) => selector({
        toggleSpeechBubble,
      }));
    });

    it('change currentUser and toggleSpeechBubble', () => {
      const { getByText } = render(<Header />);

      fireEvent.click(getByText('Log out'));

      expect(dispatch).toBeCalledWith(resettoggleSpeechBubble());
      expect(dispatch).toBeCalledTimes(2);
    });
  });

  context('without currentUser', () => {
    beforeEach(() => {
      useCurrentUser.mockImplementation(() => ({
        currentUser: null,
      }));
    });

    it('do not show user profile', () => {
      render(<Header />);

      expect(screen.findByAltText('user-profile')).toBeDefined();
    });
  });
});
