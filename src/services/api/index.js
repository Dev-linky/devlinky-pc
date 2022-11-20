import {
  githubOAuthLogin,
  getUser,
  addUser,
  getDevlink,
  addNewDevlink,
  addMyDevlink,
  githubOAuthLogout,
  getMyDevlinks,
  getDevlinksByIds,
  addMyDevlinkToPublic,
} from '../firebase';

export const fetchUrlMetaData = async (url) => {
  const response = await fetch(url, {
    method: 'GET',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
  });

  const html = await response.text();

  const el = document.createElement('div');
  el.innerHTML = html;

  const title = el.querySelector('meta[property="og:title"]')?.getAttribute('content') || '제목이 없습니다';
  const description = el.querySelector('meta[property="og:description"]')?.getAttribute('content') || '설명이 없습니다';
  const thumbnail = el.querySelector('meta[property="og:image"]')?.getAttribute('content') || '../../assets/images/img_extension_default.png';

  const preview = {
    url,
    title,
    description,
    thumbnail,
  };

  return preview;
};

export const isUser = async (firebaseUid) => {
  const response = await getUser(firebaseUid);
  return response;
};

export const autoSignup = async (user) => {
  const response = await addUser(user);
  return response;
};

export const login = async () => {
  const response = await githubOAuthLogin();

  const firebaseUserIdToken = await response.user.getIdToken(true);

  const currentUser = {
    uid: response.user.uid,
    githubId: response.additionalUserInfo.profile.login,
    githubProfile: response.user.photoURL,
    accessToken: {
      github: response.credential.accessToken,
      firebase: firebaseUserIdToken,
    },
  };

  return currentUser;
};

export const postDevlink = async ({ userId, devlink }) => {
  const response = await getDevlink({ url: devlink.url }) || await addNewDevlink(devlink);

  const result = await addMyDevlink({ userId, devlinkId: response?.uid });
  return result;
};

export const fetchMyDevlinks = async (userUid) => {
  if (process.env.NODE_ENV !== 'production') {
    const myDevlinks = await getMyDevlinks(userUid);

    const devlinkIds = myDevlinks.map((mydevlink) => mydevlink.devlinkId);

    const devlinks = await getDevlinksByIds(devlinkIds);

    const newMyDevlinks = myDevlinks.map((myDevlink) => {
      const newDevlink = devlinks.find((devlink) => devlink.id === myDevlink.devlinkId);

      return {
        id: myDevlink.id,
        devlink: newDevlink,
        comment: newDevlink.comment,
        tags: newDevlink.tags,
        isPublic: myDevlink.isPublic,
        createdAt: myDevlink.createdAt,
      };
    });

    return newMyDevlinks;
  }

  const devNewMyDevlinks = [
    {
      id: 'iMZG5pulY4L4DJiZYnRR',
      devlink: {
        id: 'YYeOgRET9ukevm2G7rRN',
        url: 'https://jeonghwan-kim.github.io/series/2019/12/10/frontend-dev-env-webpack-basic.html',
        thumbnail: 'https://jeonghwan-kim.github.io/assets/imgs/me.jpg',
        title: '잘 되네 정말로 어디 한번 노출되나보자 뿡뿡뿡',
        createdAt: '2021-07-07T19:13:49.803Z',
        updatedAt: null,
        deletedAt: null,
      },
      comment: '(1) 2줄 최대치가 얼마나 되는지 보자 좀 !!!! 코멘트 한줄노출 최대 안녕하세요',
      tags: ['java', 'ss', 'cc', 'asdf', 'asdfasdfsa'],
      isPublic: false,
      createdAt: '2021-08-20T02:10:29.499Z',
    },
    {
      id: 'wPyOagYhdnngA8AkJ7dC',
      devlink: {
        id: 'iVJFrMObJezQQb4zeyfl',
        url: 'https://github.com/daadaadaah/devlinky',
        thumbnail: 'https://github.githubassets.com/images/modules/open_graph/github-logo.png',
        title: 'Build software better, together',
        createdAt: '2021-08-20T03:38:19.978Z',
        deletedAt: null,
        updatedAt: null,
      },
      comment: '(1) fsadf',
      tags: ['Git/Github'],
      isPublic: false,
      createdAt: '2021-08-20T03:38:20.533Z',
    },
    {
      id: 'wPyOagYhdnngA8AkJ7d1',
      devlink: {
        id: 'iVJFrMObJezQQb4zeyfl',
        comment: '(1) fsadf',
        preview: {
          thumbnail: 'https://github.githubassets.com/images/modules/open_graph/github-logo.png', url: 'https://github.com/daadaadaah/devlinky', description: 'GitHub is where people build software. More than 65 million people use GitHub to discover, fork, and contribute to over 200 million projects.', title: 'Build software better, together',
        },
        url: 'https://github.com/daadaadaah/devlinky',
        tags: ['Git/Github'],
        createdAt: '2021-08-20T03:39:19.978Z',
        deletedAt: null,
        updatedAt: null,
      },
      isPublic: false,
      createdAt: '2021-08-20T03:39:20.533Z',
    },
    {
      id: 'wPyOagYhdnngA8AkJ7d2',
      devlink: {
        id: 'iVJFrMObJezQQb4zeyfl',
        comment: '(1) fsadf',
        preview: {
          thumbnail: 'https://github.githubassets.com/images/modules/open_graph/github-logo.png', url: 'https://github.com/daadaadaah/devlinky', description: 'GitHub is where people build software. More than 65 million people use GitHub to discover, fork, and contribute to over 200 million projects.', title: 'Build software better, together',
        },
        url: 'https://github.com/daadaadaah/devlinky',
        tags: ['Git/Github'],
        createdAt: '2021-08-20T03:37:19.978Z',
        deletedAt: null,
        updatedAt: null,
      },
      isPublic: false,
      createdAt: '2021-08-20T03:40:20.533Z',
    },

    {
      id: 'iMZG5pulY4L4DJiZYnR2',
      devlink: {
        id: 'YYeOgRET9ukevm2G7rRN',
        url: 'https://jeonghwan-kim.github.io/series/2019/12/10/frontend-dev-env-webpack-basic.html',
        comment: '(2) 2줄 최대치가 얼마나 되는지 보자 좀 !!!! 코멘트 한줄노출 최대 안녕하세요',
        updatedAt: null,
        tags: ['java', 'ss', 'cc', 'asdf', 'asdfasdfsa'],
        createdAt: '2021-07-07T19:13:49.803Z',
        preview: {
          url: 'https://jeonghwan-kim.github.io/series/2019/12/10/frontend-dev-env-webpack-basic.html',
          title: '잘 되네 정말로 어디 한번 노출되나보자 뿡뿡뿡',
          thumbnail: 'https://jeonghwan-kim.github.io/assets/imgs/me.jpg',
        },
        deletedAt: null,
      },
      isPublic: false,
      createdAt: '2021-08-20T02:41:29.499Z',
    },
    {
      id: 'wPyOagYhdnngA8AkJ711',
      devlink: {
        id: 'iVJFrMObJezQQb4zeyfl',
        comment: '(2) fsadf',
        preview: {
          thumbnail: 'https://github.githubassets.com/images/modules/open_graph/github-logo.png', url: 'https://github.com/daadaadaah/devlinky', description: 'GitHub is where people build software. More than 65 million people use GitHub to discover, fork, and contribute to over 200 million projects.', title: 'Build software better, together',
        },
        url: 'https://github.com/daadaadaah/devlinky',
        tags: ['Git/Github'],
        createdAt: '2021-08-20T03:37:19.978Z',
        deletedAt: null,
        updatedAt: null,
      },
      isPublic: false,
      createdAt: '2021-08-20T03:42:20.533Z',
    },
    {
      id: 'wPyOagYhdnngA8AkJ721',
      devlink: {
        id: 'iVJFrMObJezQQb4zeyfl',
        comment: '(2) fsadf',
        preview: {
          thumbnail: 'https://github.githubassets.com/images/modules/open_graph/github-logo.png', url: 'https://github.com/daadaadaah/devlinky', description: 'GitHub is where people build software. More than 65 million people use GitHub to discover, fork, and contribute to over 200 million projects.', title: 'Build software better, together',
        },
        url: 'https://github.com/daadaadaah/devlinky',
        tags: ['Git/Github'],
        createdAt: '2021-08-20T03:37:19.978Z',
        deletedAt: null,
        updatedAt: null,
      },
      isPublic: false,
      createdAt: '2021-08-20T03:43:20.533Z',
    },
    {
      id: 'wPyOagYhdnngA8AkJ732',
      devlink: {
        id: 'iVJFrMObJezQQb4zeyfl',
        comment: '(2) fsadf',
        preview: {
          thumbnail: 'https://github.githubassets.com/images/modules/open_graph/github-logo.png', url: 'https://github.com/daadaadaah/devlinky', description: 'GitHub is where people build software. More than 65 million people use GitHub to discover, fork, and contribute to over 200 million projects.', title: 'Build software better, together',
        },
        url: 'https://github.com/daadaadaah/devlinky',
        tags: ['Git/Github'],
        createdAt: '2021-08-20T03:37:19.978Z',
        deletedAt: null,
        updatedAt: null,
      },
      isPublic: false,
      createdAt: '2021-08-20T03:44:20.533Z',
    },

    {
      id: 'iMZG5pulY4L4DJiZYn4R',
      devlink: {
        id: 'YYeOgRET9ukevm2G7rRN',
        url: 'https://jeonghwan-kim.github.io/series/2019/12/10/frontend-dev-env-webpack-basic.html',
        comment: '(3) 2줄 최대치가 얼마나 되는지 보자 좀 !!!! 코멘트 한줄노출 최대 안녕하세요',
        updatedAt: null,
        tags: ['java', 'ss', 'cc', 'asdf', 'asdfasdfsa'],
        createdAt: '2021-07-07T19:13:49.803Z',
        preview: {
          url: 'https://jeonghwan-kim.github.io/series/2019/12/10/frontend-dev-env-webpack-basic.html',
          title: '잘 되네 정말로 어디 한번 노출되나보자 뿡뿡뿡',
          thumbnail: 'https://jeonghwan-kim.github.io/assets/imgs/me.jpg',
        },
        deletedAt: null,
      },
      isPublic: false,
      createdAt: '2021-08-20T02:45:29.499Z',
    },
    {
      id: 'wPyOagYhdnngA8AkJ75C',
      devlink: {
        id: 'iVJFrMObJezQQb4zeyfl',
        comment: '(3) fsadf',
        preview: {
          thumbnail: 'https://github.githubassets.com/images/modules/open_graph/github-logo.png', url: 'https://github.com/daadaadaah/devlinky', description: 'GitHub is where people build software. More than 65 million people use GitHub to discover, fork, and contribute to over 200 million projects.', title: 'Build software better, together',
        },
        url: 'https://github.com/daadaadaah/devlinky',
        tags: ['Git/Github'],
        createdAt: '2021-08-20T03:37:19.978Z',
        deletedAt: null,
        updatedAt: null,
      },
      isPublic: false,
      createdAt: '2021-08-20T03:46:20.533Z',
    },
    {
      id: 'wPyOagYhdnngA8AkJ761',
      devlink: {
        id: 'iVJFrMObJezQQb4zeyfl',
        comment: '(3) fsadf',
        preview: {
          thumbnail: 'https://github.githubassets.com/images/modules/open_graph/github-logo.png', url: 'https://github.com/daadaadaah/devlinky', description: 'GitHub is where people build software. More than 65 million people use GitHub to discover, fork, and contribute to over 200 million projects.', title: 'Build software better, together',
        },
        url: 'https://github.com/daadaadaah/devlinky',
        tags: ['Git/Github'],
        createdAt: '2021-08-20T03:37:19.978Z',
        deletedAt: null,
        updatedAt: null,
      },
      isPublic: false,
      createdAt: '2021-08-20T03:47:20.533Z',
    },
    {
      id: 'wPyOagYhdnngA8AkJ772',
      devlink: {
        id: 'iVJFrMObJezQQb4zeyfl',
        comment: '(3) fsadf',
        preview: {
          thumbnail: 'https://github.githubassets.com/images/modules/open_graph/github-logo.png', url: 'https://github.com/daadaadaah/devlinky', description: 'GitHub is where people build software. More than 65 million people use GitHub to discover, fork, and contribute to over 200 million projects.', title: 'Build software better, together',
        },
        url: 'https://github.com/daadaadaah/devlinky',
        tags: ['Git/Github'],
        createdAt: '2021-08-20T03:37:19.978Z',
        deletedAt: null,
        updatedAt: null,
      },
      isPublic: false,
      createdAt: '2021-08-20T03:48:20.533Z',
    },
  ];

  return devNewMyDevlinks;
};

export const postMyDevlinkToPublic = async ({ mydevlinkId, isPublic }) => {
  const result = await addMyDevlinkToPublic({ mydevlinkId, isPublic });
  return result;
};

export const logout = async () => {
  await githubOAuthLogout();
};
