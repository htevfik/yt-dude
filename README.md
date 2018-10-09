# yt-dude
yt-dude is an advanced crawler for YouTube. 

## Installation
`npm i --save yt-dude`

## Dependencies
There is no additional dependency other than modules ;)

## Usage
```javascript
const ytdude = require('yt-dude'), fs = require('fs');

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


// crawling any page
// returns playlist or video
// you can figure out by result.videoId or result.playlistId
([
  [
    'channel', 'https://www.youtube.com/channel/UC-9-kyTW8ZkZNDHQJ6FgpwQ'
  ],
  [
    'channelPlaylistPage', 'https://www.youtube.com/channel/UC-9-kyTW8ZkZNDHQJ6FgpwQ/playlists'
  ],
  [
    'video', 'https://www.youtube.com/watch?v=Rq3y7w_Lkgk'
  ],
  [
    'homepage', 'https://www.youtube.com/'
  ],
  [
    'trending', 'https://www.youtube.com/feed/trending'
  ],
  [
    'gaming', 'https://www.youtube.com/gaming'
  ],
  [
    'playlist', 'https://www.youtube.com/playlist?list=PLFgquLnL59an-05S-d-D1md6qdfjC0GOO'
  ]
]).map(([name, url], index) => {
  setTimeout(() => {
    // not to be banned because of too many request
    ytdude.crawl(url).then(output => {
      console.log(name, output.length, 'results');
      fs.writeFile('output/' + name + ".json", JSON.stringify(output, null, 2), err => {
        err && console.error('something went wrong??') || 'successfully wrote to json file';
      });
    }, console.error);
  }, index * 100);
});
```
