Feature('Login');

const currentUser = {
  uid: 'Uid1',
  githubId: 'daadaadaah',
  githubProfile: 'https://avatars1.githubusercontent.com/u/60481383?s=460&v=4',
  accessToken: {
    github: 'GITHUB_ACCESS_TOKEN',
    firebase: 'FIREBASE_ACCESS_TOKEN',
  },
};

Scenario('로그인 할 수 있다', async ({ I }) => {
  I.amOnPage('/');

  I.click('Github login');

  await I.executeScript((setCurrentUser) => {
    localStorage.setItem('LAST_LOGIN_USER', JSON.stringify(setCurrentUser));
  }, currentUser);

  I.refreshPage();

  I.waitForVisible({ xpath: `//img[@src='${currentUser.githubProfile}']` });
});
