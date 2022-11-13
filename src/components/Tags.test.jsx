import React from 'react';

import { fireEvent, render } from '@testing-library/react';

import Tags from './Tags';

import {
  tags, autoCompleteTags,
} from '../../fixtures';

describe('<Tags />', () => {
  const handleClickRemoveTag = jest.fn();
  const handleChangeTag = jest.fn();
  const handleClickAutoCompleteTag = jest.fn();

  beforeEach(() => {
    handleClickRemoveTag.mockClear();
    handleChangeTag.mockClear();
    handleClickAutoCompleteTag.mockClear();
  });

  context('with tags', () => {
    it('shows tags info', () => {
      const { container } = render(
        <Tags
          tags={tags}
          onClickRemoveTag={handleClickRemoveTag}
        />,
      );

      tags.forEach((tag) => {
        expect(container).toBeInTheDocument(tag);
      });
    });
  });

  context('when tags change', () => {
    it('change tags info', () => {
      const { getByLabelText } = render(
        <Tags
          tags={tags}
          onClickRemoveTag={handleClickRemoveTag}
          onChangeTag={handleChangeTag}

        />,
      );

      fireEvent.change(getByLabelText('devlink-tags'), {
        target: { value: 'rr' },
      });

      expect(handleChangeTag).toBeCalled();
    });
  });

  context('without tags', () => {
    it('change url info', () => {
      const { container } = render(
        <Tags
          tags={[]}
          onClickRemoveTag={handleClickRemoveTag}
          onChangeTag={handleChangeTag}
        />,
      );

      expect(container).toBeInTheDocument('tag 입력 후 enter를 입력해주세요');
    });
  });

  context('with autoCompleteTag', () => {
    it('show autoCompleteTag info', () => {
      const { container } = render(
        <Tags
          tags={[]}
          onClickRemoveTag={handleClickRemoveTag}
          onChangeTag={handleChangeTag}
          autoCompleteTags={autoCompleteTags}
          onClickAutoCompleteTag={handleClickAutoCompleteTag}
        />,
      );

      autoCompleteTags.forEach((autoCompleteTag) => {
        expect(container).toBeInTheDocument(autoCompleteTag);
      });
    });
  });

  context('with isShowTagsValidationMessage', () => {
    it('show autoCompleteTag info', () => {
      const { container } = render(
        <Tags
          tags={[]}
          onClickRemoveTag={handleClickRemoveTag}
          onChangeTag={handleChangeTag}
          autoCompleteTags={autoCompleteTags}
          onClickAutoCompleteTag={handleClickAutoCompleteTag}
          isShowTagsValidationMessage
        />,
      );

      expect(container).toHaveTextContent('tag 를 입력해주세요');
    });
  });
});
