import React from 'react';

import { render } from '@testing-library/react';

import Preview from './Preview';

import { preview } from '../../fixtures';

describe('<Preview />', () => {
  context('when user input comment', () => {
    it('call handleChange', () => {
      const { container, getByAltText } = render(
        <Preview
          preview={preview}
        />,
      );

      expect(container).toBeInTheDocument(preview.url);
      expect(container).toBeInTheDocument(preview.title);
      expect(container).toBeInTheDocument(preview.descrtion);
      expect(getByAltText('thumbnail')).toHaveAttribute('src', preview.thumbnail);
    });
  });
});
