# yt-dude

yt-dude is an advanced crawler for YouTube.

## Installation

`npm i --save yt-dude`

## Dependencies

There is no additional dependency other than modules ;)

## Usage

```javascript
  const ytdude = require('yt-dude');
  const { resolve } = require('path');

  Array(
    ['channel', 'https://www.youtube.com/channel/UC-9-kyTW8ZkZNDHQJ6FgpwQ'],
    ['channelPlaylistPage', 'https://www.youtube.com/channel/UC-9-kyTW8ZkZNDHQJ6FgpwQ/playlists'],
    ['video', 'https://www.youtube.com/watch?v=Rq3y7w_Lkgk'],
    ['homepage', 'https://www.youtube.com/'],
    ['trending', 'https://www.youtube.com/feed/trending'],
    ['gaming', 'https://www.youtube.com/gaming'],
    ['playlist', 'https://www.youtube.com/playlist?list=PLFgquLnL59an-05S-d-D1md6qdfjC0GOO']
  ).map(([name, url]) => {
    // crawling method can crawl anywhere
    // it returns a Promise which resolves Youtube.Video[] or Youtube.Playlist[]

    ytdude.crawl(url).then(results => {
      console.log(name, results.length, 'result(s)');
    }, console.error);
  });

  // for specificly crawling videos
  // you can use search method directly
  ytdude.search('gazirovka black').then(results => {
    let result = results[0];

    // to be sure that we have a result
    if (result) {
      // filename can point to a folder that does not exist
      // in this condition ytdude will create the path for you
      const filename = resolve(__dirname, 'mp3', result.title + '.mp3');
      ytdude.download(result, filename)
        .on('progress', progress => {
          write(filename + ": " + progress.percent + "%");
        })
        .on('done', () => {
          write();
          console.log(filename + ": Done");
        })
        .then(() => {
          // download method also can be
          // converted to a promise
          console.log('done with promise')
        }, error =>{
          // second callback as error handler
          console.error(error);
        })
        .catch(error => {
          // another method for error handling
          console.error(error);
        });
    }
  });

  // just a little helper
  function write(str = "") {
    process.stdout.cursorTo(0);
    process.stdout.clearLine(1);
    process.stdout.write(str);
  }
```

## Interfaces

### Youtube.Video

```typescript
  interface Video {
    channelId: string
    channelName: string
    channelThumbnail: string
    channelUrl: string
    channelVerified: boolean
    descriptionSnippet: string
    duration: number
    durationText: string
    durationTextLong: string
    length: number
    lengthText: string
    lengthTextLong: string
    longBylineText: string
    publishedTimeText: string
    richThumbnail: string
    shortViewCount: number
    shortViewCountText: string
    showActionMenu: boolean
    thumbnail: string
    title: string
    titleLong: string
    trackingParams: string
    videoId: string
    viewCount: number
    viewCountText: string
  }
```

### Youtube.Playlist

```typescript
  interface Playlist {
    longBylineText: string
    playlistId: string
    shortBylineText: string
    thumbnail: string
    thumbnailText: string
    title: string
    trackingParams: string
    videoCount: number
    videoCountShort: number
    videoCountShortText: string
    videoCountText: string
  }
```

### Youtube.Channel

```typescript
  interface Channel {
    channelId: string
    channelName: string
    channelThumbnail: string
    channelUrl: string
    channelVerified: boolean
  }
```