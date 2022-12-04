import config from './config';

const PROXY_SERVER_URL = 'https://my-temp-proxy.herokuapp.com/';

const CLIENT_ID = config.clientId;

const CLIENT_SECRET = config.clientSecret;

export const githubOAuthLogin = async (codeParam) => {
  const params = `?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&code=${codeParam}`;

  const response = await fetch(`${PROXY_SERVER_URL}https://github.com/login/oauth/access_token${params}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
    },
  });

  const data = await response.json();

  return data;
};

export const getUser = async (accessToeken) => {
  const response = await fetch(`${PROXY_SERVER_URL}https://api.github.com/user`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToeken}`,
      },
    });

  const data = await response.json();

  return data;
};
