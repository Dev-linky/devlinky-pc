import React, { Suspense } from 'react';

import { useSelector } from 'react-redux';

import { Switch, Route } from 'react-router-dom';

import LoadingOverlay from 'react-loading-overlay';

import GlobalStyle from './styles/GlobalStyle';
import style from './styles/designSystem';

import Header from './Header';

import { get } from './utils';

const MainPage = React.lazy(() => import('./pages/MainPage'));
const LoginPage = React.lazy(() => import('./pages/LoginPage'));

export default function App() {
  const isFullPageOverlay = useSelector(get('isFullPageOverlay'));

  return (
    <>
      <LoadingOverlay
        active={isFullPageOverlay}
        spinner
        styles={{
          wrapper: {
            position: 'relative', // 기본 style
            height: 'inherit',
          },
          content: {
            margin: 'auto', // 기본 style
            fontFamily: style.font.family.krNum,
            fontSize: '16px',
          },
        }}
        text="saving ..."
      >
        <GlobalStyle />
        <Header />
        <Switch>
          {/* TODO : fallback 디자이너와 상의해서 디자인 수정 필요 */}
          <Suspense fallback={<div>Loading...</div>}>
            <Route exact path="/login" component={LoginPage} />
            <Route exact path="/" component={MainPage} />
          </Suspense>
        </Switch>
      </LoadingOverlay>
    </>
  );
}
