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
        if (typeof text == 'string')
            return text;
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
    static videoLength(text) {
        return Parser.text(text).split('.')[0].split(/\D+/).reverse().map((x, i) => +x * Parser.multipliers[i]).reduce((a, b) => a + b);
    }
}
Parser.multipliers = [1, 60, 3600, 86400];
exports.Parser = Parser;
//# sourceMappingURL=parser.js.map