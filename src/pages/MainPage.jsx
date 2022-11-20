/* eslint-disable react/no-array-index-key */
import styled from '@emotion/styled';

import React, { useEffect } from 'react';

import { useHistory } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';

import Url from '../components/Url';
import Preview from '../components/Preview';
import Comment from '../components/Comment';
import Tags from '../components/Tags';

import Card from '../components/Card';

import style from '../styles/designSystem';

import { colors, font } from '../styles/commom';

import useCurrentUser from '../hooks/useCurrentUser';
import useUrl from '../hooks/useUrl';
import useComment from '../hooks/useComment';
import useTags from '../hooks/useTags';

import useCard from '../hooks/useCard';

import LeftArrowIcon from '../helper/Icon/LeftArrowIcon';
import RightArrowIcon from '../helper/Icon/RightArrowIcon';

import {
  fetchPreview,
  loadUrl,
  setIsShowUrlValidationMessage,
  setIsShowTagsValidationMessage,
  submitDevlink,
  setSelectTabMenu,
  setIsFullPageOverlay,
  loadMyDevlinks,
  setMyDevlinks,
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

  const mydevlinks = useSelector(get('mydevlinks'));

  if (selectTabMenu === 'archive' && isEmpty(mydevlinks)) {
    dispatch(loadMyDevlinks());
  }

  const { handleHoverCard, handleTogglePublicSetting, handleClickCard } = useCard();

  const mydevlinksPerPage = useSelector(get('mydevlinksPerPage'));

  const handleClickPageNumber = (pageNumber) => () => {
    dispatch(setMyDevlinks(mydevlinksPerPage[pageNumber - 1]));
  };

  const handleClickPrevPage = (prevPageLastNumber) => () => {
    // dispatch(lo)

  };

  const handleClickNextPage = (nextPageFirstNumber) => () => {
    // dispatch(lo)
    //

  };

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
            <ul>
              {mydevlinks?.map((mydevlink) => (
                <Card
                  key={mydevlink.id}
                  mydevlink={mydevlink}
                  onHoverCard={handleHoverCard}
                  onTogglePublicSetting={handleTogglePublicSetting}
                  onClickCard={handleClickCard}
                />
              ))}
            </ul>
            <PageNavigator>
              {/* {mydevlinksPerPage?.map((_, index) => (index + 1 <= 3 ? <li>{index + 1}</li> : <li><RightArrowIcon /></li>))} */}
              <li><LeftArrowButton onClick={handleClickPrevPage(0)}><LeftArrowIcon /></LeftArrowButton></li>
              <li><PageNumberButton onClick={handleClickPageNumber(1)}>1</PageNumberButton></li>
              <li><PageNumberButton onClick={handleClickPageNumber(2)}>2</PageNumberButton></li>
              <li><PageNumberButton onClick={handleClickPageNumber(3)}>3</PageNumberButton></li>
              <li><RightArrowButton onClick={handleClickNextPage(4)}><RightArrowIcon /></RightArrowButton></li>

              {/* <li><LeftArrowButton onClick={handleClickPrevPage(3)}><LeftArrowIcon /></LeftArrowButton></li>
              <li><PageNumberButton onClick={handleClickPageNumber(4)}>1</PageNumberButton></li>
              <li><PageNumberButton onClick={handleClickPageNumber(5)}>2</PageNumberButton></li>
              <li><PageNumberButton onClick={handleClickPageNumber(6)}>3</PageNumberButton></li>
              <li><RightArrowButton onClick={handleClickNextPage(7)}><RightArrowIcon /></RightArrowButton></li> */}
              {/*
              <li><LeftArrowButton onClick={handleClickPrevPage(6)}><LeftArrowIcon /></LeftArrowButton></li>
              <li><PageNumberButton onClick={handleClickPageNumber(7)}>1</PageNumberButton></li>
              <li><PageNumberButton onClick={handleClickPageNumber(8)}>2</PageNumberButton></li>
              <li><PageNumberButton onClick={handleClickPageNumber(9)}>3</PageNumberButton></li>
              <li><RightArrowButton onClick={handleClickNextPage(10)}><RightArrowIcon /></RightArrowButton></li> */}
            </PageNavigator>

          </>
        )}
      </Layout>
    </>
  );
}

const PageNavigator = styled.ul`
  margin-top: 20px;
  margin-left: 91px;

  width: 90px;
  height: 24px;

  display: flex;
  flex-direction: row;

  list-style: none; /* 가로 정렬 */
  
  & li {
    float: left; /* 가로 정렬 */
    display: flex;
    align-items: center;
    text-align: center;

    & button {

      color: #D4D4D4; // 선택한 아이는 : white;

    }

  }
`;

const PageNumberButton = styled.button`
  width: 20px;
  height: 24px;

  font-family: Noto Sans SC;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 17px;
`;

const LeftArrowButton = styled.button`
  margin-right: 7px;
`;

const RightArrowButton = styled.button`
  margin-left: 7px;
`;

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
