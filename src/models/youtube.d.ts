declare namespace Youtube {
  export type Stack = { videoRenderer: Youtube.SearchResult }[];

  export interface SearchResult {
    videoId: string,
    badges: Badge[],
    channelThumbnail: ThumbnailPack,
    descriptionSnippet: RunPack,
    lengthText: Text,
    longBylineText: RunPack,
    navigationEndpoint: Endpoint,
    ownerBadges: Badge[],
    publishedTimeText: Text,
    richThumbnail: RichThumbnail,
    shortBylineText: RunPack,
    shortViewCountText: Text,
    showActionMenu: boolean,
    thumbnail: ThumbnailPack,
    thumbnailOverlays: ThumbnailOverlay[],
    title: Text,
    trackingParams: string,
    viewCountText: Text
  }


  export interface Badge {
    metadataBadgeRenderer: {
      label?: string,
      style: 'BADGE_STYLE_TYPE_SIMPLE' | 'BADGE_STYLE_TYPE_VERIFIED' | 'DEFAULT',
      trackingParams: string,
      icon?: Icon,
      tooltip?: string,
    }
  }

  export interface ThumbnailPack {
    thumbnails: Thumbnail[],
    logAsMovingThumbnail?: boolean,
    webThumbnailDetailsExtensionData?: {
      isPreloaded: boolean
    }
  }

  export interface RunPack {
    runs: Run[]
  }

  export interface Run {
    text: string,
    bold?: true,
    navigationEndpoint?: Endpoint
  }

  export interface Endpoint {
    clickTrackingParams: string,
    commandMetadata: {
      webCommandMetadata: {
        sendPost?: true,
        url: string,
        webPageType?: string
      }
    },
    watchEndpoint?: {
      videoId: string
    },
    browseEndpoint?: {
      browseId: string
    },
    playlistEditEndpoint?: {
      actions: EndpointAction[],
      playlistId: string
    }
  }

  export interface Text {
    accessibilityData?: {
      label: string
    },
    accessibility?: {
      accessibilityData: {
        label: string
      }
    },
    simpleText?: string
  }

  export interface Thumbnail {
    height: number,
    url: string,
    width: number
  }

  export interface EndpointAction {
    action: 'ACTION_REMOVE_VIDEO_BY_VIDEO_ID' | 'ACTION_ADD_VIDEO',
    addedVideoId?: string,
    removedVideoId?: string
  }

  export interface RichThumbnail {
    movingThumbnailRenderer: {
      enableHoveredLogging: true,
      enableOverlay: true,
      movingThumbnailDetails: ThumbnailPack
    }
  }

  export interface Icon {
    iconType: 'CHECK_CIRCLE_THICK' | 'CHECK' | 'WATCH_LATER'
  }

  export interface ThumbnailOverlay {
    thumbnailOverlayTimeStatusRenderer?: {
      style: string,
      text: Text
    },
    thumbnailOverlayToggleButtonRenderer?: {
      isToggled: false,
      toggledAccessibility: Text,
      toggledIcon: Icon,
      toggledServiceEndpoint: Endpoint,
      toggledTooltip: string,
      untoggledAccessibility: Text,
      untoggledIcon: Icon,
      untoggledServiceEndpoint: Endpoint,
      untoggledTooltip: string
    }
  }
}