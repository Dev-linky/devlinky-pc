import React, { Suspense } from 'react';

import { render, waitFor } from '@testing-library/react';

import { MemoryRouter, useHistory } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';

import App from './App';

import { currentUser } from '../fixtures';

jest.mock('react-redux');

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: jest.fn(),
}));

describe('<App />', () => {
  const dispatch = jest.fn();

  function renderApp({ path }) {
    return render(
      <MemoryRouter initialEntries={[path]}>
        <Suspense fallback={<div>Loading...</div>}>
          <App />
        </Suspense>
      </MemoryRouter>,
    );
  }

  context('with any path ', () => {
    beforeEach(() => {
      useDispatch.mockImplementation(() => dispatch);
    });

    it('shows App name', () => {
      const { getByAltText } = renderApp({ path: '/' });

      const logo = getByAltText('devlinky-logo');
      expect(logo).toHaveAttribute('src', '../assets/images/logo-small.png');
    });
  });

  context('with path / & with currentUser', () => {
    beforeEach(() => {
      useDispatch.mockImplementation(() => dispatch);

      useSelector.mockImplementation((selector) => selector({
        currentUser,
      }));
    });

    it('shows menus', async () => {
      const { container } = renderApp({ path: '/' });

      expect(container).toHaveTextContent('newlink');
      expect(container).toHaveTextContent('archive');
    });
  });

  context('without currentUser', () => {
    const mockPush = jest.fn();

    beforeEach(() => {
      useDispatch.mockImplementation(() => dispatch);

      useSelector.mockImplementation((selector) => selector({
        currentUser: null,
      }));

      useHistory.mockImplementation(() => ({
        push: mockPush,
      }));
    });

    it('shows LoginPage', async () => {
      const { container, getByText } = renderApp({ path: '/login' });

      await waitFor(() => getByText(/login/));

      expect(container).toHaveTextContent('login');
    });
  });
});
