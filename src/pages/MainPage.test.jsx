import React, { useRef } from 'react';

import { useHistory } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';

import { fireEvent, render } from '@testing-library/react';

import MainPage from './MainPage';

import useCurrentUser from '../hooks/useCurrentUser';

import {
  setUrl,
  setComment,
  setTags,
  resetAutoCompleteTags,
  setSelectTabMenu,
  setIsShowUrlValidationMessage,
  setIsShowTagsValidationMessage,
} from '../redux/slice';

import { isNeedScroll, autoXScroll } from '../helper';

import {
  currentUser, url, preview, comment, tags, autoCompleteTags, selectTabMenu,
} from '../../fixtures';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useRef: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: jest.fn(),
}));

jest.mock('react-redux');

jest.mock('../hooks/useCurrentUser');

jest.mock('../helper');

describe('<MainPage />', () => {
  useRef.mockReturnValue({ current: null });

  context('with currentUser', () => {
    const dispatch = jest.fn();

    beforeEach(() => {
      useCurrentUser.mockImplementation(() => ({
        currentUser,
      }));

      useDispatch.mockImplementation(() => dispatch);
    });

    it('shows menus', () => {
      const { container } = render(<MainPage />);

      expect(container).toHaveTextContent('newlink');

      expect(container).toHaveTextContent('archive');
    });
  });

  context('without currentUser', () => {
    const dispatch = jest.fn();
    const mockPush = jest.fn();

    beforeEach(() => {
      useHistory.mockImplementation(() => ({
        push: mockPush,
      }));

      useCurrentUser.mockImplementation(() => ({
        currentUser: null,
      }));

      useDispatch.mockImplementation(() => dispatch);
    });

    it('redirect to LoginPage', () => {
      render(<MainPage />);

      expect(mockPush).toBeCalledWith('/login');
    });
  });

  context('when tab menu is clicked', () => {
    const dispatch = jest.fn();

    beforeEach(() => {
      useCurrentUser.mockImplementation(() => ({
        currentUser,
      }));

      useDispatch.mockImplementation(() => dispatch);

      useSelector.mockImplementation((selector) => selector({
        url,
        selectTabMenu: selectTabMenu.Menu1,
      }));
    });

    it('change selectTabMenu', () => {
      const { container, getByText } = render(<MainPage />);

      expect(container).toHaveTextContent('Save a contents');

      fireEvent.click(getByText(/archive/i));

      expect(dispatch).toBeCalledWith(setSelectTabMenu(selectTabMenu.Menu2));
    });
  });

  context('with url & preview', () => {
    const dispatch = jest.fn();

    beforeEach(() => {
      useCurrentUser.mockImplementation(() => ({
        currentUser,
      }));

      useDispatch.mockImplementation(() => dispatch);

      useSelector.mockImplementation((selector) => selector({
        url,
        preview,
        selectTabMenu: selectTabMenu.Menu1,
      }));
    });

    it('shows url info', () => {
      const { container, getByAltText } = render(<MainPage />);

      expect(container).toBeInTheDocument(preview.url);
      expect(container).toBeInTheDocument(preview.title);
      expect(container).toBeInTheDocument(preview.descrtion);
      expect(getByAltText('thumbnail')).toHaveAttribute('src', preview.thumbnail);
    });
  });

  context('without url', () => {
    const dispatch = jest.fn();

    beforeEach(() => {
      useCurrentUser.mockImplementation(() => ({
        currentUser,
      }));

      useDispatch.mockImplementation(() => dispatch);

      useSelector.mockImplementation((selector) => selector({
        url: null,
        selectTabMenu: selectTabMenu.Menu1,
      }));
    });

    it('shows preview default image', () => {
      const { getByAltText } = render(<MainPage />);

      expect(getByAltText('preview-default')).toHaveAttribute('src', '../../assets/images/preview_default.png');

      jest.useFakeTimers();

      setTimeout(() => {
        expect(dispatch).toBeCalledWith(setUrl(url));
      }, 1000);
    });
  });

  context('with url & without preview', () => {
    const dispatch = jest.fn();

    beforeEach(() => {
      useCurrentUser.mockImplementation(() => ({
        currentUser,
      }));

      useDispatch.mockImplementation(() => dispatch);

      useSelector.mockImplementation((selector) => selector({
        url,
        preview: null,
        selectTabMenu: selectTabMenu.Menu1,
      }));
    });

    it('listens change events', () => {
      const { container } = render(<MainPage />);

      expect(container).toBeInTheDocument(url);

      expect(dispatch).toBeCalledTimes(1);
    });
  });

  context('when url input is modified', () => {
    const dispatch = jest.fn();

    beforeEach(() => {
      useCurrentUser.mockImplementation(() => ({
        currentUser,
      }));

      useDispatch.mockImplementation(() => dispatch);

      useSelector.mockImplementation((selector) => selector({
        url,
        preview,
        selectTabMenu: selectTabMenu.Menu1,
      }));
    });

    it('change url', () => {
      const { getByLabelText } = render(<MainPage />);

      const newUrl = 'http://example.com';

      fireEvent.change(getByLabelText('devlink-url'), {
        target: { value: newUrl },
      });

      expect(dispatch).toBeCalledWith(setUrl(newUrl));
    });
  });

  context('when search button is clicked', () => {
    const dispatch = jest.fn();

    beforeEach(() => {
      useCurrentUser.mockImplementation(() => ({
        currentUser,
      }));

      useDispatch.mockImplementation(() => dispatch);

      useSelector.mockImplementation((selector) => selector({
        url,
        preview,
        selectTabMenu: selectTabMenu.Menu1,
      }));
    });

    it('change preivew', () => {
      const { getByLabelText } = render(<MainPage />);

      fireEvent.click(getByLabelText('search-url'));

      expect(dispatch).toBeCalledTimes(1);
    });
  });

  context('when user input comment', () => {
    const dispatch = jest.fn();

    beforeEach(() => {
      useCurrentUser.mockImplementation(() => ({
        currentUser,
      }));

      useDispatch.mockImplementation(() => dispatch);

      useSelector.mockImplementation((selector) => selector({
        url,
        preview,
        comment: null,
        selectTabMenu: selectTabMenu.Menu1,
      }));
    });

    it('change comment', () => {
      const { getByLabelText } = render(<MainPage />);

      fireEvent.change(getByLabelText('comment'), {
        target: { value: comment },
      });

      expect(dispatch).toBeCalledWith(setComment(comment));
    });
  });

  context('when user input tag', () => {
    context('and press enter', () => {
      const dispatch = jest.fn();

      beforeEach(() => {
        useCurrentUser.mockImplementation(() => ({
          currentUser,
        }));

        useDispatch.mockImplementation(() => dispatch);

        useSelector.mockImplementation((selector) => selector({
          url,
          preview,
          comment,
          tags: [tags[0]],
          autoCompleteTags: [],
          selectTabMenu: selectTabMenu.Menu1,

        }));
      });

      it('changes tags and autoCompleteTags', () => {
        const { getByLabelText } = render(<MainPage />);

        const tagInput = getByLabelText('devlink-tags');

        const newTag = tags[1];

        fireEvent.change(tagInput, {
          target: { value: newTag },
        });

        fireEvent.keyDown(tagInput, { key: 'Enter', code: 'Enter', keyCode: 13 });

        expect(dispatch).toBeCalledWith(setTags([...[tags[0]], newTag]));
        expect(dispatch).toBeCalledWith(resetAutoCompleteTags());
      });
    });

    context('and press other key, not enter', () => {
      const dispatch = jest.fn();

      beforeEach(() => {
        useCurrentUser.mockImplementation(() => ({
          currentUser,
        }));

        useDispatch.mockImplementation(() => dispatch);

        useSelector.mockImplementation((selector) => selector({
          url,
          preview,
          comment,
          tags: [tags[0]],
          autoCompleteTags: [],
          selectTabMenu: selectTabMenu.Menu1,

        }));
      });

      it('does not change Tags and AutoCompleteTags', () => {
        const { getByLabelText } = render(<MainPage />);

        const tagInput = getByLabelText('devlink-tags');

        fireEvent.keyDown(tagInput, { key: 'A', code: 'KeyA' });

        expect(dispatch).not.toBeCalledWith(setTags([tags[0]]));
        expect(dispatch).not.toBeCalledWith(resetAutoCompleteTags());
      });
    });

    context('and clears it', () => {
      const dispatch = jest.fn();

      beforeEach(() => {
        useCurrentUser.mockImplementation(() => ({
          currentUser,
        }));

        useDispatch.mockImplementation(() => dispatch);

        useSelector.mockImplementation((selector) => selector({
          url,
          preview,
          comment,
          tags: [tags[0]],
          autoCompleteTags,
          selectTabMenu: selectTabMenu.Menu1,
          isShowTagsValidationMessage: true,
        }));
      });

      it('reset AutoCompleteTags', () => {
        const { getByLabelText } = render(<MainPage />);

        const tagInput = getByLabelText('devlink-tags');

        const newTag = 'ja';

        fireEvent.change(tagInput, {
          target: { value: newTag },
        });

        expect(dispatch).toBeCalledTimes(2);

        fireEvent.change(tagInput, {
          target: { value: null },
        });

        expect(dispatch).toBeCalledWith(resetAutoCompleteTags());
      });
    });

    context('with Max tags ', () => {
      const dispatch = jest.fn();

      window.alert = jest.fn();

      beforeEach(() => {
        useCurrentUser.mockImplementation(() => ({
          currentUser,
        }));

        useDispatch.mockImplementation(() => dispatch);

        useSelector.mockImplementation((selector) => selector({
          url,
          preview,
          comment,
          tags: ['tag1', 'tag2', 'tag3', 'tag4', 'tag5'],
          autoCompleteTags: [],
          selectTabMenu: selectTabMenu.Menu1,

        }));

        isNeedScroll.mockImplementation(() => jest.fn().mockReturnValue(true));
      });

      it('do not add tag', () => {
        const { getByLabelText } = render(<MainPage />);

        const tagInput = getByLabelText('devlink-tags');

        const newTag = tags[1];

        fireEvent.change(tagInput, {
          target: { value: newTag },
        });

        fireEvent.keyDown(tagInput, { key: 'Enter', code: 'Enter', keyCode: 13 });

        expect(window.alert).toBeCalled();
      });
    });
  });

  context('when user input empty tag', () => {
    context('and press enter', () => {
      const dispatch = jest.fn();

      beforeEach(() => {
        useCurrentUser.mockImplementation(() => ({
          currentUser,
        }));

        useDispatch.mockImplementation(() => dispatch);

        useSelector.mockImplementation((selector) => selector({
          url,
          preview,
          comment,
          tags: [tags[0]],
          autoCompleteTags: [],
          selectTabMenu: selectTabMenu.Menu1,

        }));
      });

      it('does not change tags and autoCompleteTags', () => {
        const { getByLabelText } = render(<MainPage />);

        const tagInput = getByLabelText('devlink-tags');

        fireEvent.change(tagInput, {
          target: { value: null },
        });

        fireEvent.keyDown(tagInput, { key: 'Enter', code: 'Enter', keyCode: 13 });

        expect(dispatch).not.toBeCalledWith(setTags([tags[1]]));
        expect(dispatch).not.toBeCalledWith(resetAutoCompleteTags());
      });
    });
  });

  context('with autocompletTags', () => {
    const dispatch = jest.fn();

    beforeEach(() => {
      useCurrentUser.mockImplementation(() => ({
        currentUser,
      }));

      useDispatch.mockImplementation(() => dispatch);

      useSelector.mockImplementation((selector) => selector({
        url,
        preview,
        comment,
        tags,
        autoCompleteTags,
        selectTabMenu: selectTabMenu.Menu1,

      }));
    });

    it('show autocompletTags', () => {
      const { container } = render(<MainPage />);

      autoCompleteTags.forEach((autoCompleteTag) => {
        expect(container).toHaveTextContent(autoCompleteTag.name);
      });
    });
  });

  context('when user click tag remove button && with isNeedScroll', () => {
    const dispatch = jest.fn();

    beforeEach(() => {
      useCurrentUser.mockImplementation(() => ({
        currentUser,
      }));

      useDispatch.mockImplementation(() => dispatch);

      useSelector.mockImplementation((selector) => selector({
        url,
        preview,
        comment,
        tags,
        autoCompleteTags: [],
        selectTabMenu: selectTabMenu.Menu1,

      }));

      isNeedScroll.mockReturnValue(true);
    });

    it('change tags', () => {
      const { getAllByTitle } = render(<MainPage />);

      fireEvent.click(getAllByTitle('remove-tag')[0]);

      expect(dispatch).toBeCalledWith(resetAutoCompleteTags());

      expect(autoXScroll).toBeCalled();
    });
  });

  context('when user click tag remove button && without isNeedScroll', () => {
    const dispatch = jest.fn();

    beforeEach(() => {
      useCurrentUser.mockImplementation(() => ({
        currentUser,
      }));

      useDispatch.mockImplementation(() => dispatch);

      useSelector.mockImplementation((selector) => selector({
        url,
        preview,
        comment,
        tags: [tags[0]],
        autoCompleteTags: [],
        selectTabMenu: selectTabMenu.Menu1,

      }));

      isNeedScroll.mockReturnValue(false);
      autoXScroll.mockClear();
    });

    it('change tags', () => {
      const { getAllByTitle } = render(<MainPage />);

      fireEvent.click(getAllByTitle('remove-tag')[0]);

      expect(dispatch).toBeCalledWith(resetAutoCompleteTags());

      expect(autoXScroll).not.toBeCalled();
    });
  });

  context('when user select autocompletTags', () => {
    const dispatch = jest.fn();

    beforeEach(() => {
      useCurrentUser.mockImplementation(() => ({
        currentUser,
      }));

      useDispatch.mockImplementation(() => dispatch);

      useSelector.mockImplementation((selector) => selector({
        url,
        preview,
        comment,
        tags,
        autoCompleteTags,
        selectTabMenu: selectTabMenu.Menu1,

      }));
    });

    it('change tags and autoCompleteTags', () => {
      const { getByText } = render(<MainPage />);

      fireEvent.click(getByText(`#${autoCompleteTags[0].name}`));

      expect(dispatch).toBeCalledWith(resetAutoCompleteTags());
      expect(dispatch).toBeCalledWith(setTags([...tags, autoCompleteTags[0].name]));
    });
  });

  context('when user click save button', () => {
    context('with required input value,', () => {
      const dispatch = jest.fn();

      beforeEach(() => {
        useCurrentUser.mockImplementation(() => ({
          currentUser,
        }));

        useDispatch.mockImplementation(() => dispatch);

        useSelector.mockImplementation((selector) => selector({
          url,
          preview,
          comment,
          tags,
          autoCompleteTags: [],
          selectTabMenu: selectTabMenu.Menu1,

        }));
      });

      it('save devlink', () => {
        const { getByText } = render(<MainPage />);

        fireEvent.click(getByText(/Save a contents/i));

        expect(dispatch).toBeCalledTimes(2);
      });
    });

    context('without required input value', () => {
      const dispatch = jest.fn();
      window.alert = jest.fn();

      beforeEach(() => {
        useCurrentUser.mockImplementation(() => ({
          currentUser,
        }));

        useDispatch.mockImplementation(() => dispatch);

        useSelector.mockImplementation((selector) => selector({
          url,
          preview,
          comment, // TODO : 코멘트 필수 입력 논의 후 수정 필요
          tags: [],
          autoCompleteTags: [],
          selectTabMenu: selectTabMenu.Menu1,
          isShowTagsValidationMessage: true,
        }));
      });

      it('do not save devlink', () => {
        const { container, getByText } = render(<MainPage />);

        fireEvent.click(getByText(/Save a contents/i));

        expect(dispatch).toBeCalledWith(setIsShowTagsValidationMessage(true));
        expect(container).toHaveTextContent('tag 를 입력해주세요');
      });
    });

    context('without required input value', () => {
      const dispatch = jest.fn();
      window.alert = jest.fn();

      beforeEach(() => {
        useCurrentUser.mockImplementation(() => ({
          currentUser,
        }));

        useDispatch.mockImplementation(() => dispatch);

        useSelector.mockImplementation((selector) => selector({
          url: null,
          preview,
          comment, // TODO : 코멘트 필수 입력 논의 후 수정 필요
          tags: [],
          autoCompleteTags: [],
          selectTabMenu: selectTabMenu.Menu1,

        }));
      });

      it('do not save devlink', () => {
        const { getByText } = render(<MainPage />);

        fireEvent.click(getByText(/Save a contents/i));

        expect(dispatch).toBeCalledWith(setIsShowUrlValidationMessage(true));
      });
    });
  });

  context('when user input tag and press enter', () => {
    context('with isNeedScroll', () => {
      const dispatch = jest.fn();

      beforeEach(() => {
        useCurrentUser.mockImplementation(() => ({
          currentUser,
        }));

        useDispatch.mockImplementation(() => dispatch);

        useSelector.mockImplementation((selector) => selector({
          url,
          preview,
          comment,
          tags: [tags[0]],
          autoCompleteTags: [],
          selectTabMenu: selectTabMenu.Menu1,

        }));

        isNeedScroll.mockImplementation(() => jest.fn().mockReturnValue(true));
      });

      it('call autoScroll', () => {
        const { getByLabelText } = render(<MainPage />);

        const tagInput = getByLabelText('devlink-tags');

        const newTag = tags[1];

        fireEvent.change(tagInput, {
          target: { value: newTag },
        });

        fireEvent.keyDown(tagInput, { key: 'Enter', code: 'Enter', keyCode: 13 });

        expect(dispatch).toBeCalledWith(setTags([...[tags[0]], newTag]));
        expect(dispatch).toBeCalledWith(resetAutoCompleteTags());

        expect(autoXScroll).toBeCalled();
      });
    });
  });
});
