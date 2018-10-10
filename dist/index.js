"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./prototype/all");
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
        this.downloader = new downloader_1.default();
    }
    download(video, saveTo) {
        return this.downloader.download(video, saveTo);
    }
    crawl(url) {
        return extractor_1.default.get(url);
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
exports = module.exports = new YoutubeDude();
//# sourceMappingURL=index.js.map