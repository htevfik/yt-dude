declare namespace Dude {
  export interface ProgressEvent {
    percent: number,
    totalTime: number,
    currentTime: number,
  }

  export interface Result {
    id?: number,
    videoId: string,
    title: string,
    titleLong: string,
    description: string,
    length: number,
    lengthText: string,
    viewCount: number,
    viewCountText: string,
    viewCountTextLong: string,
    publishedTime: string,
    thumbnail: string,
    richThumbnail: string,
    channelId: string,
    channelTitle: string,
    channelThumbnail: string,
    channelVerified: boolean,
  }

  export interface Video {
    id?: number,
    videoId: string,
    title: string,
    description: string,
    length: number,
    viewCount: number,
    publishedTime: string,
    thumbnail: string,
    richThumbnail: string,
    channelId: string,
  }

  export interface Channel {
    id?: number,
    channelId: string,
    title: string,
    thumbnail: string,
    verified: boolean
  }
}