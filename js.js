console.log('BOOOM')



const str = "Finally opened our textile factory @felt #highthreadcount";


const tweetParser = ((tweet) => {
  console.log(tweet);
  const results = [];
  const tweetArr = tweet.split('');
  console.log(tweetArr);
  for (let i = 0; i < tweetArr.length; i++) {
    if (tweetArr[i] === '@') {
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
      results.push(tweetItem);
    }
    if (tweetArr[i] === '#') {
      console.log('YOOO')
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
      results.push(tweetItem);
    }
  }
  console.log(results);
});


const data = tweetParser(str);
console.log(data);
