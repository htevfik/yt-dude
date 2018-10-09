"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parser_1 = require("../crawler/parser");
const cheerio = require("cheerio");
function runExtractor(body) {
    const chunk = extract(body), items = {};
    for (let stack of chunk) {
        stack = walk(stack);
        if (stack) {
            for (let item of stack) {
                let id = item.videoId || item.playlistId;
                items[id] = merge(items[id] || {}, scalarData(item));
            }
        }
    }
    return Object.keys(items).map(k => items[k]);
}
exports.runExtractor = runExtractor;
function merge(...group) {
    const o = {};
    for (let item of group) {
        for (let [k, v] of entries(item)) {
            let a = o[k];
            if (!a) {
                o[k] = v;
            }
            else {
                if (a instanceof Array) {
                    if (v instanceof Array) {
                        o[k] = [...a, ...v];
                    }
                    else {
                        o[k].push(v);
                    }
                }
                else if (v) {
                    o[k] = v;
                }
            }
        }
    }
    return o;
}
function scalarData(item) {
    let output = {}, sorted = {};
    for (let [k, v] of entries(item)) {
        let dived = dive(k, v);
        if (dived == null) {
            continue;
        }
        if (typeof dived === 'object') {
            output = Object.assign({}, output, dived);
        }
        else {
            output[k] = dived;
        }
    }
    for (let k of Object.keys(output).sort()) {
        sorted[k] = output[k];
    }
    return sorted;
}
function unique(array, ...exclude) {
    return array.filter((e, i, a) => a.indexOf(e) === i && exclude.indexOf(e) === -1);
}
function dive(name, value) {
    if (!value) {
        return value;
    }
    if (/string|number|boolean/.test(typeof value)) {
        return { [name]: value };
    }
    else if (value instanceof Array) {
        let simplified = value.map(item => {
            let keys = Object.keys(item);
            if (keys.length === 1) {
                let dived = dive(keys[0], item[keys[0]]);
                return entries(dived, true)[0];
            }
        }).filter(Boolean);
        simplified = unique(simplified);
        if (simplified.length > 0) {
            return { [name]: simplified };
        }
    }
    if (value.runs instanceof Array) {
        let channelUrl, channelId, channelName;
        if (name == 'shortBylineText') {
            channelUrl = value.runs.map(item => child(item, 'navigationEndpoint.commandMetadata.webCommandMetadata.url')).filter(Boolean)[0];
            if (channelUrl) {
                return { channelId: channelUrl.split(/\/+/).reverse().filter(Boolean)[0], channelUrl, channelName: parser_1.Parser.runs(value) };
            }
        }
        return { [name]: parser_1.Parser.runs(value) };
    }
    if (value.simpleText) {
        let label = parser_1.Parser.label(value);
        return Object.assign({ [name]: value.simpleText }, label ? { [name + 'Long']: parser_1.Parser.label(value) } : {}, /count/i.test(name) ? { [name.replace(/text$/i, '')]: +value.simpleText.replace(/\D+/g, '') } : {}, name == 'lengthText' ? { length: parser_1.Parser.videoLength(value) } : {});
    }
    if (value.thumbnails instanceof Array) {
        let thumbnails = value.thumbnails.map(thumbnail => thumbnail.url), thumbnail = thumbnails[0] || null;
        return thumbnails.length > 1 ? { [name + 's']: thumbnails, [name]: thumbnail } : { [name]: thumbnail };
    }
    let pairs = {
        richThumbnail: 'movingThumbnailRenderer.movingThumbnailDetails',
        thumbnailRenderer: 'playlistVideoThumbnailRenderer.thumbnail',
    };
    if (pairs[name]) {
        return dive(name, child(value, pairs[name]));
    }
    switch (name) {
        case 'ownerBadges':
            value = value.find(badge => child(badge, 'metadataBadgeRenderer.style'));
            return { channelVerified: /_VERIFIED$/.test(value) };
        case 'thumbnailOverlays':
            let overlay = value.map(overlay => child(overlay, 'thumbnailOverlayTimeStatusRenderer.text')).filter(Boolean)[0];
            let { durationText, durationTextLong } = dive('durationText', overlay) || {};
            if (durationText) {
                return { duration: parser_1.Parser.videoLength(durationText), durationText, durationTextLong };
            }
    }
}
function walk(chunk) {
    const output = [];
    function inner(object) {
        for (let [k, v] of entries(object)) {
            if (typeof v == 'object') {
                if (hasKeys(v, ['videoId', 'thumbnail', 'title']) ||
                    hasKeys(v, ['playlistId', 'thumbnail', 'title'])) {
                    output.push(v);
                    continue;
                }
                else {
                    inner(v);
                }
            }
        }
    }
    inner(chunk);
    return output;
}
function child(object, path, def = null) {
    if (!object || !path)
        return object || def;
    for (let step of String(path).split('.')) {
        if (object && object[step]) {
            object = object[step];
        }
        else {
            return def;
        }
    }
    return object || def;
}
function hasKeys(object, keys) {
    let objectKeys = Object.keys(object);
    keys = keys instanceof Array ? keys : String(keys).split(/\W+/);
    for (let key of keys) {
        if (objectKeys.indexOf(key) === -1) {
            return false;
        }
    }
    return true;
}
function entries(object, values = false) {
    return Object.keys(object || {}).map(k => values ? object[k] : [k, object[k]]);
}
function extract(body) {
    const $ = cheerio.load(body), output = [];
    for (let script of Array.from($('script'))) {
        let html = $(script).html();
        html = cutAfter(html, 'window["ytInitialData"] = ', 'ytInitialGuideData = ');
        if (html) {
            html = html.substring(0, html.indexOf('};'));
            try {
                output.push(JSON.parse(html + "}"));
            }
            catch (err) {
                console.log(err.name, html.substring(0, 20), '...', html.substring(html.length - 20));
            }
        }
    }
    return output;
}
function cutAfter(stack, ...needles) {
    for (let needle of needles) {
        let index = stack.indexOf(needle);
        if (index > -1) {
            return stack.substring(index + needle.length);
        }
    }
    return null;
}
//# sourceMappingURL=extractor.js.map