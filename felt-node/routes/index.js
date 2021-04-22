var express = require('express');
var router = express.Router();
const got = require('got');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

function getMentionInfo(tweetArr, i) {
  let ind = i + 1;
  let mentionName = '';
  let temp;
  while (temp !== ' ' && ind < tweetArr.length) {
    temp = tweetArr[ind];
    mentionName += tweetArr[ind];
    ind++;
  }
  const tweetItem = {
    kind: 'mention',
    name: mentionName,
    start: i + 1,
    end: ind,
  }
  return tweetItem;
}

function getHashtagInfo(tweetArr, i) {
  let ind = i + 1;
  let mentionName = '';
  let temp;
  while (temp !== ' ' && ind < tweetArr.length) {
    temp = tweetArr[ind];
    mentionName += tweetArr[ind];
    ind++;
  }
  const tweetItem = {
    kind: 'hashtag',
    name: mentionName,
    start: i + 1,
    end: ind,
  }
  return tweetItem;
}

async function tweetParser(tweet) {
  const results = [];
  const tweetArr = tweet.split('');
  for (let i = 0; i < tweetArr.length; i++) {
    if (tweetArr[i] === '@') {
      const tweetItem = getMentionInfo(tweetArr, i);
      results.push(tweetItem);
    }
    if (tweetArr[i] === '#') {
      const tweetItem = getHashtagInfo(tweetArr, i);
      results.push(tweetItem);
    }
    if (tweetArr[i] === 'h' && tweetArr.slice(i, i + 4).join('') === 'http') {
      const linkInfo = await getLinkInformation(tweetArr, i);
      results.push(linkInfo);
    }
  }
  return results;
};

async function getLinkInformation(tweetArr, i) {
  let parseUrl = parseLinkFromString(tweetArr, i);
  let data;
  let url;
  let title;
  let thumbNail;
  try {
    data = await got(parseUrl);
    url = data.redirectUrls.length > 0 ? data.redirectUrls[data.redirectUrls.length - 1] : parseUrl;
    const dom = new JSDOM(data.body);
    result = dom.window.document.querySelectorAll(`meta[property='og:image']`);
    title = dom.window.document.querySelector('title').textContent;
    if (result[0]) {
      thumbNail = result[0].content;
    }
    else {
      thumbNail = '';
    }
  }
  catch(err) {
    throw(err);
    data = err['code'];
    url = 'invalid-url';
    title = '';
    thumbNail = '';
  }

  return {
    title,
    thumbNail,
    kind: 'link',
    originalUrl: parseUrl,
    redirectUrl: url,
  }
}

function parseLinkFromString(tweetArr, i) {
  console.log(i);
  let parseUrl = '';
  let ind = i;
  let temp;
  temp = tweetArr[ind]
  while (
    ind <= tweetArr.length
    && temp !== ' '
    && temp !== ','
    && temp !== '!'
    && temp !== ';'
    && temp !== ')'
    && temp !== ']'
    && temp !== '"'
    && temp !== `'`
    && temp !== '`'
    && (temp !== '.'
      || (temp === '.'
        && (
          tweetArr[ind + 1] !== ' '
          || tweetArr[ind + 1] !== '"'
          || tweetArr[ind + 1] !== `'`
        )
      )
    )
  ) {
    if (ind > i) {
      parseUrl += temp;
      temp = tweetArr[ind];
    }
    ind++;
  }
  return parseUrl;
}

router.post('/parse', async function(req, res, next) {
  console.log(req.body);
  let tweetResult;
  try {
    tweetResult = await tweetParser(req.body.tweet);
    console.log(tweetResult);

  }
  catch(err) {
    console.log(err);
    tweetResult = err;
  }
  res.json(tweetResult);
});

module.exports = router;
