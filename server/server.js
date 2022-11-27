const express = require('express');
const cors = require('cors');

const fetch = (...args) => import('node-fetch').then(({ default: fetch2 }) => fetch2(...args));

const bodyParser = require('body-parser');

const CLIENT_ID = '71c4a24a1bfaad197a54';
const CLIENT_SECRET = '46d5c5229dcfd0669c3010b20161af5bfd33144e';

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get('/getAccessToken', async (req, res) => {
  const params = `?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&code=${req.query.code}`;

  await fetch(`https://github.com/login/oauth/access_token${params}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
    },
  }).then((response) => response.json()).then((data) => {
    res.json(data);
  });
});

app.get('/getUserData', async (req, res) => {
  await fetch('https:/api.github.com/user', {
    method: 'GET',
    headers: {
      Authorization: req.get('Authorization'),
    },
  }).then((response) => response.json()).then((data) => {
    res.json(data);
  });
});

// TODO : 프록시 서버 구축 후 구현 생각해보기
// app.post('/setIssue', async (req, res) => {
//   // req.get("Authorization");

//   await fetch('https://api.github.com/repos/daadaadaah/commit-pocket/issues', {
//     method: 'POST',
//     headers: {
//       Authorization: 'Bearer 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',
//     },
//     body: {
//       title: 'Found a bug',
//       body: 'sadfd',
//     },
//   }).then((response) => {
//     // console.log("[createIssue] response : ", response.json())
//     responese.json()).then((data) => {
//     console.log(data);
//     res.json(data);
//   });
// });

app.listen(4000, () => {
  console.log('CORS server running on port 4000');
});
