# yt-dude
yt-dude is an advanced crawler for YouTube. 

## Installation
`npm i --save yt-dude`

## Dependencies
There is no additional dependency other than modules ;)

## Usage
```javascript
const ytdude = require('yt-dude');

ytdude.verbose = false; // to output ongoing things
ytdude.queueLimit = 5; // to limit queue (default is 5)

ytdude.search('gazirovka black').then(results => {
  const result = results[0];
  ytdude.download(result, './mp3/' + result.videoId + '.mp3').on('progress', event => {
    console.log('downloading progress ' + result.title + ' ' + event.percent);
    // also event.currentTime and event.totalTime in numbers
  }).on('done', () => {
    console.log(result.title + ' downloaded');
  });
});
```
