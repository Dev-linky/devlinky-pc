const config = {
  apiKey: '',
  authDomain: '',
  projectId: '',
  storageBucket: '',
  databaseURL: '',
  messagingSenderId: '',
  appId: '',
  measurementId: '',
};

const firebase = {
  auth: () => ({
    GithubAuthProvider: new Promise((resolve) => resolve()),
    signInWithPopup: () => new Promise((resolve) => resolve({
      credential: {
        accessToken: 'GITHUB_ACCESS_TOKEN',
      },
      user: {
        uid: 'devuid',
        email: 'dev@devlink.com',
        photoURL: 'https://some-new-url-here',
        getIdToken: jest.fn().mockResolvedValue('FIREBASE_ACCESS_TOKEN'),
      },
    })),
  }),
};

const githubOAuthLogin = firebase.auth().signInWithPopup();

export {
  config, firebase, githubOAuthLogin,
};
