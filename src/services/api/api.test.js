import login from '.';

import { currentUser } from '../../../fixtures';

jest.mock('../firebase');

describe('api', () => {
  describe('login', () => {
    it('returns currentUser', async () => {
      const data = await login();

      expect(data).toEqual({ currentUser });
    });
  });
});
