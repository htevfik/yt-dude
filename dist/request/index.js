"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const requestPromise = require("request-promise");
const URL = require("url");
const Path = require("path");
const filesystem_1 = require("./filesystem");
class Request {
    constructor() {
        this.headers = {
            accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
            'accept-encoding': "gzip",
            'accept-language': "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7,ru;q=0.6",
            'cache-control': "max-age=0",
            cookie: "VISITOR_INFO1_LIVE=pFbQsaRav8E; PREF=f1=50000000; YSC=sqhan-_xa-I; GPS=1",
            dnt: "1",
            'upgrade-insecure-requests': "1",
            'user-agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36",
        };
    }
    request(url) {
        const { headers } = this;
        return requestPromise({ url, headers, gzip: true });
    }
    static createCachePath(url) {
        let { pathname, query, hostname, protocol, port } = URL.parse(url), path, file;
        protocol = protocol.replace(':', '').toLowerCase();
        hostname = hostname || 'HOSTNAME';
        port = port || ({ http: 80, https: 443, ftp: 21, ssh: 22 })[protocol];
        pathname = pathname == '/' ? null : pathname;
        query = query || 'index';
        path = Path.join(...['cache', hostname, protocol, port, pathname].filter(Boolean).map(String));
        file = Path.join(path, query + ".html");
        return { path, file };
    }
    cache(url, body) {
        const { path, file } = Request.createCachePath(url);
        if (body === void 0) {
            return filesystem_1.filesystem.stat(file).then(stats => {
                // if cache file older than 30 minutes 
                return Date.now() - stats.mtime.getTime() > 18e5 ? null : filesystem_1.filesystem.read(file);
            }, err => {
                return err.code === 'ENOENT' ? null : err;
            });
        }
        return filesystem_1.filesystem.makePath(path, true).then(() => {
            return filesystem_1.filesystem.write(file, body);
        }).then(() => {
            return body;
        });
    }
    get(url) {
        return this.cache(url).then(result => {
            return result || this.request(url).then(body => {
                return this.cache(url, body).then(() => body);
            });
        });
    }
}
const request = new Request();
exports.request = request;
//# sourceMappingURL=index.js.map