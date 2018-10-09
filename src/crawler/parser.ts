export class Parser {
  public static child<T>(object, path, def = null): T {
    def = def || object;

    if (!object || !path) {
      return def;
    }

    for (let step of path.split('.')) {
      if (object) {
        object = object[step];
      } else {
        break;
      }
    }

    return object || def;
  }

  public static extract(result: Youtube.SearchResult): Dude.Result {
    return {
      videoId: result.videoId,
      title: Parser.text(result.title),
      titleLong: Parser.text(result.title, true),
      description: Parser.runs(result.descriptionSnippet),
      length: Parser.videoLength(result.lengthText),
      lengthText: Parser.text(result.lengthText),
      viewCount: Parser.viewCount(result),
      viewCountText: Parser.text(result.shortViewCountText),
      viewCountTextLong: Parser.text(result.viewCountText),
      publishedTime: Parser.text(result.publishedTimeText),
      thumbnail: Parser.thumbnail(result.thumbnail),
      richThumbnail: Parser.thumbnail(result.richThumbnail.movingThumbnailRenderer.movingThumbnailDetails),
      channelId: Parser.channelId(result.longBylineText || result.shortBylineText),
      channelTitle: Parser.runs(result.longBylineText || result.shortBylineText),
      channelThumbnail: Parser.thumbnail(result.channelThumbnail),
      channelVerified: Parser.verified(result.ownerBadges)
    };
  }

  public static viewCount(result: Youtube.SearchResult) {
    let text = Parser.text(result.viewCountText) || "";
    text = text.replace(/\D+/g, "");
    return parseInt(text);
  }

  public static verified(badges: Youtube.Badge[]) {
    if (badges) {
      for (let badge of badges) {
        if (Parser.child(badge, 'metadataBadgeRenderer.style') == 'BADGE_STYLE_TYPE_VERIFIED') {
          return true;
        }
      }
    }

    return false;
  }

  public static runs(pack: Youtube.RunPack) {
    let o = "";

    if (pack && (pack.runs instanceof Array)) {
      for (let run of pack.runs) {
        o += run.text || "";
      }
    }

    return o.replace(/\s+/g, " ");
  }

  public static channelId(pack: Youtube.RunPack) {
    let o = "";

    if (pack && (pack.runs instanceof Array)) {
      for (let run of pack.runs) {
        let url = Parser.child(run, 'navigationEndpoint.commandMetadata.webCommandMetadata.url') as string;

        if (url) {
          o = url.split('/').reverse()[0];
        }
      }
    }

    return o || null;
  }

  public static text(text: Youtube.Text, label = false) {
    if (!text) return "";
    if (typeof text == 'string') return text;

    let o: any;

    if (label) {
      o = (text.accessibility || text);
      o = text && text.accessibilityData;
      o = o && o.label;
    } else {
      o = text && text.simpleText;
    }

    return o || "";
  }

  public static thumbnail(pack: Youtube.ThumbnailPack) {
    if (pack && (pack.thumbnails instanceof Array)) {
      for (let thumbnail of pack.thumbnails) {
        if (thumbnail) {
          return thumbnail.url || null;
        }
      }
    }

    return null;
  }

  private static readonly multipliers = [1, 60, 3600, 86400];
  public static videoLength(text: Youtube.Text): number {
    return Parser.text(text).split('.')[0].split(/\D+/).reverse().map((x, i) => +x * Parser.multipliers[i]).reduce((a, b) => a + b);
  }
}