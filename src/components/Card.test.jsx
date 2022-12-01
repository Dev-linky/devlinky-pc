import React from 'react';

import { fireEvent, render } from '@testing-library/react';

import Card from './Card';

import { mydevlink } from '../../fixtures';

describe('<Card />', () => {
  const handleHoverCard = jest.fn();
  const handleTogglePublicSetting = jest.fn();
  const handleClickCard = jest.fn();

  beforeEach(() => {
    handleHoverCard.mockClear();
    handleTogglePublicSetting.mockClear();
    handleClickCard.mockClear();
  });

  context('when card is hover', () => {
    it('call handleHoverCard', () => {
      const { getByText } = render(
        <Card
          mydevlink={{
            ...mydevlink,
            isShowCardHoverMenu: true,
          }}
          onHoverCard={handleHoverCard}
          onTogglePublicSetting={handleTogglePublicSetting}
          onClickCard={handleClickCard}
        />,
      );

      fireEvent.mouseEnter(getByText(mydevlink.devlink.preview.title));

      expect(handleHoverCard).toBeCalled();

      fireEvent.mouseLeave(getByText(mydevlink.devlink.preview.title));

      expect(handleHoverCard).toBeCalled();
    });
  });

  context('when card is clicked', () => {
    it('call handleClickCard', () => {
      const { getByText } = render(
        <Card
          mydevlink={mydevlink}
          onHoverCard={handleHoverCard}
          onTogglePublicSetting={handleTogglePublicSetting}
          onClickCard={handleClickCard}
        />,
      );

      fireEvent.click(getByText(mydevlink.devlink.preview.title));

      expect(handleClickCard).toBeCalled();
    });
  });

  context('with isShowCardHoverMenu is true', () => {
    it('show hover menu', () => {
      const { getByText } = render(
        <Card
          mydevlink={{
            ...mydevlink,
            isShowCardHoverMenu: true,
          }}
          onHoverCard={handleHoverCard}
          onTogglePublicSetting={handleTogglePublicSetting}
          onClickCard={handleClickCard}
        />,
      );

      expect(getByText('공유하기')).toBeVisible();
    });
  });

  context('with isPublic is true', () => {
    it('show hover menu', () => {
      const { getByText } = render(
        <Card
          mydevlink={{
            ...mydevlink,
            isPublic: true,
          }}
          onHoverCard={handleHoverCard}
          onTogglePublicSetting={handleTogglePublicSetting}
          onClickCard={handleClickCard}
        />,
      );

      expect(getByText('비공개 설정')).toBeInTheDocument();
    });
  });
});
