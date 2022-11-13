import styled from '@emotion/styled';

import React from 'react';

import { useDispatch, useSelector } from 'react-redux';

import useCurrentUser from './hooks/useCurrentUser';

import style from './styles/designSystem';

import { removeCurrentUser, settoggleSpeechBubble, resettoggleSpeechBubble } from './redux/slice';

import { get } from './utils';

export default function Header() {
  const { currentUser } = useCurrentUser();

  const dispatch = useDispatch();

  const toggleSpeechBubble = useSelector(get('toggleSpeechBubble'));

  const handleClickProfile = () => {
    dispatch(settoggleSpeechBubble(!toggleSpeechBubble));
  };

  const handleClickLogout = () => {
    dispatch(removeCurrentUser());
    dispatch(resettoggleSpeechBubble());
  };

  return (
    <Layout>
      <Logo src="../assets/images/logo-small.png" alt="devlinky-logo" />
      {currentUser && (
        <>
          <Profile src={currentUser.githubProfile} onClick={handleClickProfile} alt="user-profile" />
          <SpeechBubble toggleSpeechBubble={toggleSpeechBubble}>
            <SpeechTail />
            <Bubble>
              <button type="button" onClick={handleClickLogout}>Log out</button>
            </Bubble>
          </SpeechBubble>
        </>
      )}
    </Layout>
  );
}

const Layout = styled.header`
  padding: ${style.common.interval.small} ${style.common.interval.tiny} 0;

  & img:nth-of-type(1) {
    margin-top: 6px;
  }

  & img:nth-of-type(2) {
    margin-left: 128px;
  }
`;

const Logo = styled.img`
  width: 120px;
  height: 21px;
`;

const Profile = styled.img`
  height: 32px;
  width: 32px;
  border-radius: 50%;
  cursor:  pointer;
`;

const SpeechBubble = styled.div`
  position: absolute;
  top: 66px;
  left: 244px;
  
  display: ${({ toggleSpeechBubble }) => (toggleSpeechBubble ? 'block' : 'none')};
  width: 57px;
  height: 33px;
  cursor:  pointer;

  & div:nth-of-type(1) {
    position: absolute;
    top: 0%;
    right: 22%;
    bottom: 64%;
    left: 62%;
  }

  & div:nth-of-type(2) {
    position: absolute;   
    top: 12%;
    right: 0%;
    bottom: 0%;
    left: 0%;
 
    & button {
      position: absolute;
      top: 0%;
      right: 0%;
      bottom: 0%;
      left: 18%;
    }
  }
`;

const SpeechTail = styled.div`
  width: 9px;
  height: 9px;
  border-radius: 1px;
  transform: rotate(45deg);
  background: ${style.button.normal.background};
`;

const Bubble = styled.div`
  background: ${style.button.normal.background};
  border-radius: 10px;

  & button {
    background: transparent;

    display: flex;
    align-items: center;
    font-size: ${style.font.size.tiny};
    font-weight: ${style.font.weight.black};
    color: ${style.button.normal.color};
  }
`;
