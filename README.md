# yt-dude
yt-dude is an advanced crawler for YouTube. For now, you can search for videos.

## Installation
`npm i --save yt-dude`

## Usage
```javascript
const  crawler = require('yt-dude');

crawler.verbose = true;
crawler.search('gazirovka black').then(results  => {
	console.log(results[0]);
});
```

## Output
`GET:` [https://www.youtube.com/results?search_query=gazirovka%20black](https://www.youtube.com/results?search_query=gazirovka%20black)
`19 results found`
```javascript
{ 
	videoId: 'l3XIJgA8OZk',
	title: 'GAZIROVKA - Black (2017)',
	titleLong: '',
	description: 'GAZIROVKA - Black (Танцы в моей кровати) iTunes: https://itunes.apple.com/ru/album/black-single/1320926469 ...',
	length: 165,
	lengthText: '2:45',
	viewCount: 116387394,
	viewCountText: '116 Mn görüntüleme',
	viewCountTextLong: '116.387.394 görüntüleme',
	publishedTime: '9 ay önce',
	thumbnail: 'https://i.ytimg.com/vi/l3XIJgA8OZk/hqdefault.jpg?sqp=-oaymwEZCPYBEIoBSFXyq4qpAwsIARUAAIhCGAFwAQ==&rs=AOn4CLBjanMTFnYcJnT-vSeVXQqE969n-w',
	richThumbnail: 'https://i.ytimg.com/an_webp/l3XIJgA8OZk/mqdefault_6s.webp?du=3000&sqp=CNyv3t0F&rs=AOn4CLAbTTYDdEzUrmnZ0osNEtbVtVDJQQ',
	channelId: 'UCHDl4zUzU0VLFG036unHY-w',
	channelTitle: 'Black Beats',
	channelThumbnail: 'https://lh3.googleusercontent.com/a-/AN66SAzffJ41hRP_lEbPPrpPx1CLZnhf_HUicAYukA=s88-c-k-c0x00ffffff-no-rj-mo',
	channelVerified: true 
}
```