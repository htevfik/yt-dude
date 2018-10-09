"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request_1 = require("../request");
const filesystem_1 = require("../request/filesystem");
const extractor_1 = require("./extractor");
class Extractor {
    cache(url, body) {
        const { path, json } = request_1.Request.createCachePath(url);
        if (body === void 0) {
            return filesystem_1.filesystem.stat(json).then(stats => {
                // if cache file older than 30 minutes 
                return Date.now() - stats.mtime.getTime() > 18e5 ? null : filesystem_1.filesystem.read(json);
            }, err => {
                return err.code === 'ENOENT' ? null : err;
            }).then(json => {
                if (json) {
                    try {
                        return JSON.parse(json);
                    }
                    catch (err) { }
                }
                return null;
            });
        }
        return filesystem_1.filesystem.makePath(path, true).then(() => {
            return filesystem_1.filesystem.write(json, body);
        }).then(() => {
            return body;
        });
    }
    get(url) {
        return this.cache(url).then(result => {
            return result || request_1.request.get(url).then(body => {
                const data = extractor_1.runExtractor(body), json = JSON.stringify(data);
                return this.cache(url, json).then(() => data);
            });
        });
    }
}
exports.extractor = new Extractor();
//# sourceMappingURL=index.js.map