import config from './config';

// const PROXY_SERVER_URL = 'https://my-temp-proxy.herokuapp.com/';
const PROXY_SERVER_URL =
  'https://21swnpibr1.execute-api.ap-northeast-2.amazonaws.com/login/';

const CLIENT_ID = config.clientId;

const CLIENT_SECRET = config.clientSecret;

export const githubOAuthLogin = async (codeParam) => {
  const params = `?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&code=${codeParam}`;

  const response = await fetch(
    // `${PROXY_SERVER_URL}https://github.com/login/oauth/access_token${params}`,
    `https://github.com/login/oauth/access_token${params}`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
    }
  );

  const data = await response.json();

  return data;
};

export const getUser = async (accessToeken) => {
  const response = await fetch(
    // `${PROXY_SERVER_URL}https://api.github.com/user`,
    'https://api.github.com/user',
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToeken}`,
      },
    }
  );

  const data = await response.json();

  return data;
};

const createIssueQuery = `  mutation {
  createIssue(input:{
       repositoryId:"R_kgDOGHdamA",
       title:"title test",
       body: 
       "body test"
  }){
    issue{
      id
      url
    }
  }
}`;

export const getIssues = async ({ accessToken }) => {
  const query = `{
  repository(name: "aiShoppingMall", owner: "jiyeonLeeLuda") {
    issues(last: 3) {
      totalCount
      edges {
        cursor
        node {
          body
          bodyHTML
          bodyText
          labels(first: 100) {
            edges {
              node {
                id
                name
              }
            }
          }
          title
        }
      }
    }
  }
}`;

  const response = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      query,
    }),
  });

  const { data } = await response.json();
  console.log(data);
  return data;
};

export const getIssuesPerPage = async ({ accessToken, beforeLastCursor }) => {
  const before = beforeLastCursor ? `before: ${beforeLastCursor}` : '';

  const query = `{
  repository(name: "aiShoppingMall", owner: "jiyeonLeeLuda") {
    issues(last: 9 ${before}) {
      totalCount
      edges {
        cursor
        node {
          body
          bodyHTML
          bodyText
          labels(first: 100) {
            edges {
              node {
                id
                name
              }
            }
          }
          title
        }
      }
    }
  }
}`;

  const response = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      query,
    }),
  });

  const { data } = await response.json();
  console.log(data);
  return data;
};
