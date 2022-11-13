Feature('Header');

const logoImagePath = '../assets/images/logo-small.png';

const currentUser = {
  uid: 'Uid1',
  githubId: 'daadaadaah',
  githubProfile: 'https://avatars1.githubusercontent.com/u/60481383?s=460&v=4',
  accessToken: {
    github: 'GITHUB_ACCESS_TOKEN',
    firebase: 'FIREBASE_ACCESS_TOKEN',
  },
};

Scenario('로고가 보인다.', ({ I }) => {
  I.amOnPage('/');

  I.waitForVisible({ xpath: `//img[@src='${logoImagePath}']` });
});

Scenario('이전에 로그인한 기록이 있으면, 사용자 프로필이 보인다.', async ({ I }) => {
  I.amOnPage('/');

  await I.executeScript((setCurrentUser) => {
    localStorage.setItem('LAST_LOGIN_USER', JSON.stringify(setCurrentUser));
  }, currentUser);

  I.refreshPage();

  I.waitForVisible({ xpath: `//img[@src='${currentUser.githubProfile}']` });
});

Scenario('이전에 로그인한 기록이 없으면, 사용자 프로필이 안 보인다.', async ({ I }) => {
  I.amOnPage('/');

  I.waitForInvisible({ xpath: `//img[@src='${currentUser.githubProfile}']` });
});

Scenario('로그아웃할 수 있다.', async ({ I }) => {
  I.amOnPage('/');

  await I.executeScript((setCurrentUser) => {
    localStorage.setItem('LAST_LOGIN_USER', JSON.stringify(setCurrentUser));
  }, currentUser);

  I.refreshPage();

  I.click({ xpath: `//img[@src='${currentUser.githubProfile}']` });

  I.click('Log out');

  I.see('Github login');
});
