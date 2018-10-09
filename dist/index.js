"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crawler_1 = require("./crawler");
const downloader_1 = require("./downloader");
const extractor_1 = require("./extractor");
class YoutubeDude {
    constructor() {
        this.url = 'https://www.youtube.com';
        // shortcuts
        this.channels = {
            music: 'UC-9-kyTW8ZkZNDHQJ6FgpwQ',
            sport: 'UCEgdi0XIXXZ-qJOFPf4JSKw',
            news: 'UCYfdidRxbB8Qhf0Nx7ioOYw',
            live: 'UC4R8DWoMoI7CAwX8_LjQHig',
            vr: 'UCzuqhhs6NWbgTzMuM09WKDQ'
        };
    }
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
    download(video, saveTo) {
        return downloader_1.downloader.download(video, saveTo);
    }
    crawl(url) {
        return extractor_1.extractor.get(url);
    }
    search(terms) {
        return this.crawl(this.url + '/results?search_query=' + encodeURIComponent(terms));
    }
    feed() {
        return this.crawl(this.url);
    }
    gaming() {
        return this.crawl(this.url + '/gaming');
    }
    trending() {
        return this.crawl(this.url + '/feed/trending');
    }
    // channel videos
    channel(id) {
        return this.crawl(this.url + '/channel/' + id);
    }
    music() {
        return this.channel(this.channels.music);
    }
    sport() {
        return this.channel(this.channels.sport);
    }
    news() {
        return this.channel(this.channels.news);
    }
    live() {
        return this.channel(this.channels.live);
    }
    vr() {
        return this.channel(this.channels.vr);
    }
}
exports.YoutubeDude = YoutubeDude;
module.exports = new YoutubeDude();
//# sourceMappingURL=index.js.map