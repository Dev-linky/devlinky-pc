/* eslint-disable react/no-array-index-key */
import { useRef } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import {
  setTags,
  loadAutoCompleteTags,
  resetAutoCompleteTags,
  removeTag,
  resetIsShowTagsValidationMessage,
} from '../redux/slice';

import { isEmpty, get } from '../utils';

import { isNeedScroll, autoXScroll } from '../helper';

const useTags = () => {
  const dispatch = useDispatch();

  const isShowTagsValidationMessage = useSelector(get('isShowTagsValidationMessage'));

  const tags = useSelector(get('tags'));
  const inputTagRef = useRef();

  const autoCompleteTags = useSelector(get('autoCompleteTags'));
  const ulTagsRef = useRef();

  const handleChangeTag = (e) => {
    if (isShowTagsValidationMessage) {
      dispatch(resetIsShowTagsValidationMessage());
    }

    const newTag = e.target.value.toUpperCase().trim();

    if (isEmpty(newTag)) {
      dispatch(resetAutoCompleteTags());
    } else {
      dispatch(loadAutoCompleteTags(newTag));
    }
  };

  const SCROLL_X_VALUE = 60; // TODO : 얼만큼 이동하는게 UX적으로 좋을지 디자이너와 상의 후 x값 픽스하기

  // eslint-disable-next-line no-underscore-dangle
  const _handleAddTag = (tag) => {
    if (tags.length === 5) {
      window.alert('태그는 최대 5개까지 가능합니다.'); // TODO : UI 디자인 나오면 수정 필요
      return;
    }

    dispatch(setTags([...tags, tag]));
    inputTagRef.current.value = '';
    dispatch(resetAutoCompleteTags());
    // 최대 태그 입력 갯수 정하기
    if (isNeedScroll(inputTagRef)) {
      const MOVE_RIGHT = SCROLL_X_VALUE;

      autoXScroll(ulTagsRef, MOVE_RIGHT);
    }
  };

  const handleKeyDownEnter = (e) => {
    const newTag = e.target.value.trim();
    const ENTER = 13;

    if (e.keyCode === ENTER) {
      if (newTag && tags.indexOf(newTag) === -1) {
        _handleAddTag(newTag);
      }
    }
  };

  const handleClickAutoCompleteTag = (index) => () => {
    const newAutoCompleteTag = autoCompleteTags[index].name;

    _handleAddTag(newAutoCompleteTag);
  };

  const handleClickRemoveTag = (removeIndex) => () => {
    dispatch(removeTag(removeIndex));
    dispatch(resetAutoCompleteTags());

    if (isNeedScroll(inputTagRef)) {
      const MOVE_LEFT = -SCROLL_X_VALUE;

      autoXScroll(ulTagsRef, MOVE_LEFT);
    }
  };

  return [
    tags, inputTagRef, ulTagsRef, handleChangeTag, handleKeyDownEnter, handleClickRemoveTag,
    autoCompleteTags, handleClickAutoCompleteTag,
    isShowTagsValidationMessage,
  ];
};

export default useTags;
