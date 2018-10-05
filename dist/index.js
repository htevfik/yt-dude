"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crawler_1 = require("./crawler");
const downloader_1 = require("./downloader");
class YoutubeDude {
    set verbose(val) {
        crawler_1.crawler.verbose = val;
        downloader_1.downloader.verbose = val;
    }
    get queueLimit() {
        return downloader_1.downloader.limit;
    }
    set queueLimit(val) {
        downloader_1.downloader.limit = val;
    }
    search(keywords) {
        return crawler_1.crawler.search(keywords);
    }
    download(video, saveTo) {
        return downloader_1.downloader.download(video, saveTo);
    }
}
exports.YoutubeDude = YoutubeDude;
module.exports = new YoutubeDude();
//# sourceMappingURL=index.js.map