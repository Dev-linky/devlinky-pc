import { isNeedScroll, autoXScroll } from '.';

describe('isNeedScroll', () => {
  context('with inputTag.offsetLeft < 220px', () => {
    it('return false', () => {
      const ref = {
        current: {
          offsetLeft: 100,
        },
      };

      expect(isNeedScroll(ref)).toBe(false);
    });
  });

  context('with inputTag.offsetLeft > 220px', () => {
    it('return true', () => {
      const ref = {
        current: {
          offsetLeft: 400,
        },
      };

      expect(isNeedScroll(ref)).toBe(true);
    });
  });
});

test('autoXScroll', () => {
  const ref = {
    current: {
      scrollBy: jest.fn(),
    },
  };

  autoXScroll(ref, 60);

  expect(ref.current.scrollBy).toBeCalled();
});
