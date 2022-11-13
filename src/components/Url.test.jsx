import React from 'react';

import { fireEvent, render } from '@testing-library/react';

import Url from './Url';

import { url, preview } from '../../fixtures';

describe('<Url />', () => {
  context('with url', () => {
    it('shows url info', () => {
      const { container } = render(
        <Url
          url={url}
        />,
      );

      expect(container).toBeInTheDocument(preview.url);
    });
  });

  context('when url change', () => {
    const handleChangeUrl = jest.fn();

    it('call handleChange', () => {
      const { getByLabelText } = render(
        <Url
          url=""
          onChangeUrl={handleChangeUrl}
        />,
      );

      fireEvent.change(getByLabelText('devlink-url'), {
        target: { value: url },
      });

      expect(handleChangeUrl).toBeCalled();
    });
  });

  context('when user click search button', () => {
    const handleSeatchUrl = jest.fn();

    it('call handleChange', () => {
      const { getByLabelText } = render(
        <Url
          url={url}
          onSeatchUrl={handleSeatchUrl}
        />,
      );

      fireEvent.click(getByLabelText('search-url'));

      expect(handleSeatchUrl).toBeCalled();
    });
  });

  context('when isShowUrlValidationMessage', () => {
    const handleSeatchUrl = jest.fn();

    it('call handleChange', () => {
      const { container, getByLabelText } = render(
        <Url
          url={url}
          isShowUrlValidationMessage
          onSeatchUrl={handleSeatchUrl}
        />,
      );

      fireEvent.click(getByLabelText('search-url'));

      expect(container).toHaveTextContent('URL을 입력해주세요');
    });
  });
});
