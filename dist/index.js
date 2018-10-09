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
    crawl(url) {
        return crawler_1.crawler.crawlUrl(url);
    }
    music() {
        return this.crawl('https://www.youtube.com/channel/UC-9-kyTW8ZkZNDHQJ6FgpwQ');
    }
    sport() {
        return this.crawl('https://www.youtube.com/channel/UCEgdi0XIXXZ-qJOFPf4JSKw');
    }
    news() {
        return this.crawl('https://www.youtube.com/channel/UCYfdidRxbB8Qhf0Nx7ioOYw');
    }
    live() {
        return this.crawl('https://www.youtube.com/channel/UC4R8DWoMoI7CAwX8_LjQHig');
    }
    vr() {
        return this.crawl('https://www.youtube.com/channel/UCzuqhhs6NWbgTzMuM09WKDQ');
    }
    gaming() {
        return this.crawl('https://www.youtube.com/gaming');
    }
    feed() {
        return this.crawl('https://www.youtube.com/');
    }
    trending() {
        return this.crawl('https://www.youtube.com/feed/trending');
    }
}
exports.YoutubeDude = YoutubeDude;
module.exports = new YoutubeDude();
//# sourceMappingURL=index.js.map