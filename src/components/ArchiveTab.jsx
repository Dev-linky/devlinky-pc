import styled from '@emotion/styled';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useCard from '../hooks/useCard';
import { setMyDevlinks } from '../redux/slice';
import { get } from '../utils';
import Card from './Card';
import SearchBar from './SearchBar';

import LeftArrowIcon from '../helper/Icon/LeftArrowIcon';
import RightArrowIcon from '../helper/Icon/RightArrowIcon';

const ArchiveTab = ({ mydevlinks }) => {
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

  const links = useSelector(get('mydevlinksAll'));
  const dispatch = useDispatch;
  const { handleHoverCard, handleTogglePublicSetting, handleClickCard } =
    useCard();

  console.log('확인!!', mydevlinks[0]);
  const onSearchComment = (keyWord) => {
    console.log(links);
    const searchedLinks = links.filter((item) =>
      item.devlink.comment.includes(keyWord)
    );
    console.log(searchedLinks);
    dispatch(setMyDevlinks(searchedLinks));
  };

  return (
    <>
      {/* TODO : 나중에 구현하기 */}
      {/* <SearchBar onSearchComment={onSearchComment} /> */}
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
        <li>
          <LeftArrowButton onClick={handleClickPrevPage(0)}>
            <LeftArrowIcon />
          </LeftArrowButton>
        </li>
        <li>
          <PageNumberButton onClick={handleClickPageNumber(1)}>
            1
          </PageNumberButton>
        </li>
        <li>
          <PageNumberButton onClick={handleClickPageNumber(2)}>
            2
          </PageNumberButton>
        </li>
        <li>
          <PageNumberButton onClick={handleClickPageNumber(3)}>
            3
          </PageNumberButton>
        </li>
        <li>
          <RightArrowButton onClick={handleClickNextPage(4)}>
            <RightArrowIcon />
          </RightArrowButton>
        </li>
      </PageNavigator>
    </>
  );
};

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
      color: #d4d4d4; // 선택한 아이는 : white;
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
export default ArchiveTab;
