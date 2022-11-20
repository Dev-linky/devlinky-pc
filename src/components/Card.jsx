import styled from '@emotion/styled';

import React, { useCallback } from 'react';

import FacebookShareIcon from '../helper/Icon/FacebookShareIcon';
import KakaoShareIcon from '../helper/Icon/KakaoShareIcon';

import style from '../styles/designSystem';

export default function Card({
  mydevlink, onHoverCard, onTogglePublicSetting, onClickCard,
}) {
  const AddOneLine = (node) => {
    if (node?.getBoundingClientRect().height <= 20) { // tags가 1줄이라면
      node.style.marginTop = '20px';
    }
  };

  const ulTagsCallbackRef = useCallback(AddOneLine, []);

  console.log('mydevlink : tags', mydevlink);

  return (
    <CardWrapper
      onMouseEnter={onHoverCard(mydevlink.id)}
      onMouseLeave={onHoverCard(mydevlink.id)}
    >
      <CardThumbnailWrapper>
        <img src={mydevlink.devlink.preview.thumbnail} alt="" />
        <Mask isShowCardHoverMenu={mydevlink.isShowCardHoverMenu} />
        <ShareWrapper isShowCardHoverMenu={mydevlink.isShowCardHoverMenu}>
          <p>공유하기</p>
          <button type="button">
            <KakaoShareIcon />
          </button>
          <button type="button">
            <FacebookShareIcon />
          </button>
          <p>{mydevlink.isPublic ? '비공개 설정' : '공개 설정'}</p>
          <Switch onClick={onTogglePublicSetting(mydevlink.id)}>
            <Shape>
              <Oval isPublic={mydevlink.isPublic} />
            </Shape>
          </Switch>
        </ShareWrapper>
      </CardThumbnailWrapper>
      <CardDetailWrapper onClick={onClickCard(mydevlink.devlink.url)}>
        <CardComment>{mydevlink.devlink.comment}</CardComment>
        <CardTitle>{mydevlink.devlink.preview.title}</CardTitle>
        <TagsWrapper ref={ulTagsCallbackRef}>
          {mydevlink?.tags?.map((tag, index) => (
            // TODO : 테스트 커버 해야 됨
            <li key={index}>
              <TagText>{`#${tag}`}</TagText>
            </li>
          ))}
        </TagsWrapper>
      </CardDetailWrapper>
    </CardWrapper>
  );
}

const CardThumbnailWrapper = styled.div`
  position: relative;

  > * {
    width: 108px;
    height: 108px;
  }
`;

const Mask = styled.div`
  display: ${({ isShowCardHoverMenu }) => (isShowCardHoverMenu ? 'block' : 'none')};
  position: absolute;
  top: 0;
  background: #242835;
  opacity: 0.8;
`;

const ShareWrapper = styled.div`
  display: ${({ isShowCardHoverMenu }) => (isShowCardHoverMenu ? 'block' : 'none')};

  position: absolute;
  top: 0;

  text-align: center;

  & p {
    font-size: 12px;
    margin: 6px 0 4px 0;
  }

  & button {    
    width: 25px;
    height: 25px;

    margin: 2px 4px 10px 0;
  }
`;

const Switch = styled.div`
  position: absolute;
  width: 36px;
  height: 20px;
`;

const Oval = styled.div`
  position: absolute;
  width: 16px;
  height: 16px;
  left:  ${({ isPublic }) => (isPublic ? '4px' : '18px')};
  top: calc(50% - 16px/2);

  background: #FFFFFF;
  border-radius: 18px;

  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.08);
  transform: matrix(-1, 0, 0, 1, 0, 0);
`;

const Shape = styled.div`
  position: absolute;
  height: 20px;
  left: 36px;
  right: -36px;
  top: calc(50% - 20px/2);

  background: #C3CBCD;
  border-radius: 18px;
  transform: matrix(-1, 0, 0, 1, 0, 0);
`;

const CardWrapper = styled.li`
  position: relative;
  display: flex;
  width: 272px;
  height: 108px;

  margin-top: 16px;

  background: ${style.colors.yoonblue.mediumDark};
  border-radius: 15px;



  & img {
    width: 108px;
    height: 108px;

    border-radius: 15px 0 0 15px;

  }
`;

const CardDetailWrapper = styled.div`
  width: 164px;
  padding: 10px 12px 10px 12px;

  cursor: pointer;
`;

const CardComment = styled.p`
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;

  font-family: ${style.font.family.krNum};
  font-weight: 500;
  font-size: 12px;
  line-height: 15px;
`;

const CardTitle = styled.p`
  margin-top: 4px;

  font-family: ${style.font.family.krNum};
  font-weight: 300;
  font-size: 10px;
  line-height: 13px;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  color: #FFFFFF;

  opacity: 0.8;
`;

const TagsWrapper = styled.ul` 
  position: absolute;
  top: 58px;

  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  & li {
    margin: 4px 4px 0 0 ;

    height: 16px;

    background: #8F8ECF;
  
    border-radius: 40px;

  }
`;

const TagText = styled.span`
  display: flex;
  align-items: center;

  margin: 2px 6px;

  text-transform: uppercase;

  font-weight: ${style.font.weight.bold};
  font-size: 10px;
  line-height: 12px;

  color:  ${style.colors.white};
`;
