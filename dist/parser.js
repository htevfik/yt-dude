"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Parser {
    static child(object, path, def = null) {
        def = def || object;
        if (!object || !path) {
            return def;
        }
        for (let step of path.split('.')) {
            if (object) {
                object = object[step];
            }
            else {
                break;
            }
        }
        return object || def;
    }
    static extract(result) {
        return {
            videoId: result.videoId,
            title: Parser.text(result.title),
            titleLong: Parser.text(result.title, true),
            description: Parser.runs(result.descriptionSnippet),
            length: Parser.videoLenth(result.lengthText),
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
    static viewCount(result) {
        let text = Parser.text(result.viewCountText) || "";
        text = text.replace(/\D+/g, "");
        return parseInt(text);
    }
    static verified(badges) {
        if (badges) {
            for (let badge of badges) {
                if (Parser.child(badge, 'metadataBadgeRenderer.style') == 'BADGE_STYLE_TYPE_VERIFIED') {
                    return true;
                }
            }
        }
        return false;
    }
    static runs(pack) {
        let o = "";
        if (pack && (pack.runs instanceof Array)) {
            for (let run of pack.runs) {
                o += run.text || "";
            }
        }
        return o.replace(/\s+/g, " ");
    }
    static channelId(pack) {
        let o = "";
        if (pack && (pack.runs instanceof Array)) {
            for (let run of pack.runs) {
                let url = Parser.child(run, 'navigationEndpoint.commandMetadata.webCommandMetadata.url');
                if (url) {
                    o = url.split('/').reverse()[0];
                }
            }
        }
        return o || null;
    }
    static text(text, label = false) {
        if (!text)
            return "";
        let o;
        if (label) {
            o = (text.accessibility || text);
            o = text && text.accessibilityData;
            o = o && o.label;
        }
        else {
            o = text && text.simpleText;
        }
        return o || "";
    }
    static thumbnail(pack) {
        if (pack && (pack.thumbnails instanceof Array)) {
            for (let thumbnail of pack.thumbnails) {
                if (thumbnail) {
                    return thumbnail.url || null;
                }
            }
        }
        return null;
    }
    static videoLenth(text) {
        let time = Parser.text(text).match(/\d+/) || [], length = 0;
        for (let i = time.length - 1; i > -1; i--) {
            length += Parser.multipliers[i] * parseInt(time[i]);
        }
        return length;
    }
}
Parser.multipliers = [1, 60, 3600, 86400];
exports.Parser = Parser;
//# sourceMappingURL=parser.js.map