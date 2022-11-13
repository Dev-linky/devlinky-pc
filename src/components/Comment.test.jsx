import React from 'react';

import { fireEvent, render } from '@testing-library/react';

import Comment from './Comment';

import { comment } from '../../fixtures';

describe('<Comment />', () => {
  const handleChangeCommnet = jest.fn();

  beforeEach(() => {
    handleChangeCommnet.mockClear();
  });

  context('when user input comment', () => {
    it('call handleChange', () => {
      const { getByLabelText } = render(
        <Comment
          comment=""
          onChangeComment={handleChangeCommnet}
        />,
      );

      fireEvent.change(getByLabelText('devlink-comment'), {
        target: { value: comment },
      });

      expect(handleChangeCommnet).toBeCalled();
    });
  });
});
