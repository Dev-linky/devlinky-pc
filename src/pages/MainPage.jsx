/* eslint-disable react/no-array-index-key */
import styled from '@emotion/styled';

import React, { useEffect } from 'react';

import { useHistory } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';

import Url from '../components/Url';
import Preview from '../components/Preview';
import Comment from '../components/Comment';
import Tags from '../components/Tags';

import style from '../styles/designSystem';

import { colors, font } from '../styles/commom';

import useCurrentUser from '../hooks/useCurrentUser';
import useUrl from '../hooks/useUrl';
import useComment from '../hooks/useComment';
import useTags from '../hooks/useTags';

import {
  fetchPreview,
  loadUrl,
  setIsShowUrlValidationMessage,
  setIsShowTagsValidationMessage,
  submitDevlink,
  setSelectTabMenu,
  setIsFullPageOverlay,
} from '../redux/slice';

import { isEmpty, get } from '../utils';

export default function MainPage() {
  const history = useHistory();

  const { currentUser } = useCurrentUser();

  useEffect(() => {
    if (isEmpty(currentUser)) {
      history.push('/login');
    }
  }, [currentUser]);

  const dispatch = useDispatch();

  const selectTabMenu = useSelector(get('selectTabMenu'));

  const handleClickTabMenu = (e) => {
    const newSelectTabMenu = e.target.textContent;

    dispatch(setSelectTabMenu(newSelectTabMenu));
  };

  const [url, inputUrlRef, handleChangeUrl, handleSearchUrl, isShowUrlValidationMessage] = useUrl();

  if (isEmpty(url)) {
    dispatch(loadUrl());
  }

  const preview = useSelector(get('preview'));

  if (url && isEmpty(preview)) {
    dispatch(fetchPreview());
  }

  const [comment, onChangeComment] = useComment();

  const [
    tags, inputTagRef, ulTagsRef, handleChangeTag, handleKeyDownEnter, handleClickRemoveTag,
    autoCompleteTags, handleClickAutoCompleteTag,
    isShowTagsValidationMessage,
  ] = useTags();

  const handleClickSave = () => {
    if (isEmpty(url)) {
      dispatch(setIsShowUrlValidationMessage(true));
      inputUrlRef.current.focus();
      return;
    }

    if (isEmpty(tags)) {
      dispatch(setIsShowTagsValidationMessage(true));
      inputTagRef.current.focus();
      return;
    }

    // TODO : 코멘트 필수 입력 논의 후 수정 필요

    dispatch(submitDevlink());
    dispatch(setIsFullPageOverlay(true));
  };

  return (
    <>
      <TabMenus selectTabMenu={selectTabMenu}>
        <li>
          <button type="button" onClick={handleClickTabMenu}>newlink</button>
        </li>
        <li>
          <button type="button" onClick={handleClickTabMenu}>archive</button>
        </li>
      </TabMenus>
      <Layout>
        {selectTabMenu === 'newlink' ? (
          <form>
            <Url
              url={url}
              inputUrlRef={inputUrlRef}
              onChangeUrl={handleChangeUrl}
              onSeatchUrl={handleSearchUrl}
              isShowUrlValidationMessage={isShowUrlValidationMessage}
            />
            <Preview
              preview={preview}
            />
            <Comment
              comment={comment}
              onChangeComment={onChangeComment}
            />
            <Tags
              tags={tags}
              inputTagRef={inputTagRef}
              ulTagsRef={ulTagsRef}
              onChangeTag={handleChangeTag}
              onKeyDownEnter={handleKeyDownEnter}
              onClickRemoveTag={handleClickRemoveTag}
              autoCompleteTags={autoCompleteTags}
              onClickAutoCompleteTag={handleClickAutoCompleteTag}
              isShowTagsValidationMessage={isShowTagsValidationMessage}
            />
            <SaveButton type="button" id="btn-save" onClick={handleClickSave}>Save a contents</SaveButton>
          </form>
        ) : (
          <>
            <p>archive tab menu</p>
          </>
        )}
      </Layout>
    </>
  );
}

const TabMenus = styled.ul`  
  margin-top: 30px;

  width: 100%;
  height: 38px;

  padding-left: 24px;
  list-style: none; /* 가로 정렬 */
  
  & li {
    float: left; /* 가로 정렬 */

    height: 100%;
    font-size: ${font.size.large};

    line-height: 24px;

    & button {
        color: ${style.common.color};
        background: transparent;

        font-size: 20px;
        font-weight: ${style.font.weight.bold};

        text-transform: capitalize;
    }
  }

  & li:nth-of-type(2) {
    margin-left: 16px;
  }
  
  & li:nth-of-type(${({ selectTabMenu }) => (selectTabMenu === 'newlink' ? 1 : 2)}) {
    border-bottom: 3px solid ${colors.white}; /* 선택 */
  }

  & li:nth-of-type(${({ selectTabMenu }) => (selectTabMenu === 'newlink' ? 2 : 1)}){
    opacity: 0.5; /* 미 선택 */
  }
`;

const Layout = styled.div`
  padding: ${style.common.interval.small} ${style.common.interval.small} 48px;
`;

const SaveButton = styled.button`
  position: fixed;
  top: 510px;
  margin: 0 20px;

  width: 240px;
  height: 42px;
  background: ${style.button.normal.background};
  border-radius: 63px;

  font-size: ${style.button.font.size};
  font-weight: ${style.font.weight.medium};

  color:  ${style.button.normal.color};

  &:hover {
    background-color:${style.button.hover.background};
  }
`;
