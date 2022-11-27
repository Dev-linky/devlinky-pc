import styled from '@emotion/styled';

import React, { useEffect } from 'react';

import { useDispatch } from 'react-redux';

import { useHistory } from 'react-router-dom';

import useCurrentUser from '../hooks/useCurrentUser';

import { loadCurrentUser } from '../redux/slice';

import { colors, font } from '../styles/commom';

import style from '../styles/designSystem';

export default function LoginPage() {
  const dispatch = useDispatch();

  const history = useHistory();

  const { currentUser } = useCurrentUser();

  useEffect(() => {
    if (currentUser) {
      history.push('/');
      return;
    }

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const codeParam = urlParams.get('code');

    if (codeParam) {
      dispatch(loadCurrentUser(codeParam));
    }
  }, [currentUser]);

  const handleClickLogin = () => {
    const CLIENT_ID = '71c4a24a1bfaad197a54';
    const SCOPE = 'repo, user';

    window.location.assign(`https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=${SCOPE}`);
  };

  return (
    <main>
      {/* 문구 수정 필요 */}
      <Welcome>어떤 문구를 넣어야 되나어떤 문구를 넣어야 되나어떤 문구를 넣어야 되나어떤 문구를 넣어야 되나어떤 문구를 넣어야 되나</Welcome>
      <LoginButton type="button" id="btn-login" onClick={handleClickLogin}>Github login</LoginButton>
    </main>
  );
}

const Welcome = styled.p`
  position: fixed;
  top: 263px;

  width: 320px;

  padding: 0 ${style.common.interval.small};

  color:  ${colors.gray.light};

  text-align: center;
  font-family: ${font.family.krNum};
  font-size: ${font.size.regular};;
  font-weight: ${font.weight.light};

`;

const LoginButton = styled.button`
  position: fixed;
  top: 510px;
  margin: 0 40px;

  width: 240px;
  height: 42px;

  font-size: ${style.button.font.size};;
  font-weight: ${style.button.font.weight};
  color:  ${style.button.normal.color};

  background: ${style.button.normal.background};
  border-radius: 63px;

  
  &:hover {
    background-color:${style.button.hover.background};
  }
`;
