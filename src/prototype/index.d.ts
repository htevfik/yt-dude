declare interface ObjectConstructor {
  walk(object: any, callback: (value: any, key: string, parent: any) => void)
  child(object: any, ...path: string[])
  values(object: any): any[]
  entries(object: any): [string, any][]
  entries(object: any[]): [number, any][]
  hasKeys(object: any, ...keys: string[]): boolean
}

declare interface String {
  splitAfter(...needles: string[]): string
  splitUntil(...needles: string[]): string
}

declare interface Array<T> {
  unique(...filter: T[]): Array<T>
  first: T
  firstValid: T
  last: T
  lastValid: T
}

declare namespace Youtube {
  export interface Playlist {
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

  export interface Video {
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

  export interface Channel {
    channelId: string
    channelName: string
    channelThumbnail: string
    channelUrl: string
    channelVerified: boolean
  }

  export interface DownloadProgress {
    totalTime: number
    currentTime: number
    percent: number
  }

  export interface Text extends Label {
    simpleText: string
    accessibility: Label
  }

  export interface Label {
    accessibilityData: {
      label: string
    }
  }
}