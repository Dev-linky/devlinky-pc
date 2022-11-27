export const githubOAuthLogin = async (codeParam) => {
  const response = await fetch(`http://localhost:4000/getAccessToken?code=${codeParam}`, { method: 'GET' });

  const data = await response.json();

  return data;
};

export const getUser = async (accessToeken) => {
  const response = await fetch('http://localhost:4000/getUserData',
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToeken}`,
      },
    });

  const data = await response.json();

  return data;
};
