"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const queue_1 = require("./queue");
class Downloader {
    constructor() {
        this.limit = 5;
        this.queue = [];
        this.verbose = false;
    }
    add(video, saveTo) {
        const item = new queue_1.QueueItem(video, saveTo);
        item.on('done', () => {
            this.remove(item);
        });
        this.queue.push(item);
        this.check();
        return item;
    }
    remove(item) {
        this.queue.splice(this.queue.indexOf(item), 1);
        this.check();
    }
    check() {
        let waiting = this.queue.filter(item => !item.active), times = this.limit - (this.queue.length - waiting.length);
        waiting.slice(0, times).map(item => {
            item.download();
        });
    }
    checkArguments(video, saveTo) {
        if (!video) {
            throw new Error('Video not set!');
        }
        else if (!saveTo) {
            throw new Error('Output file path not set!');
        }
        else if (!video.videoId) {
            throw new TypeError('video must be a DudeVideo');
        }
        else if (typeof saveTo != 'string') {
            throw new TypeError('saveTo must be a string');
        }
    }
    download(video, saveTo) {
        return this.checkArguments(video, saveTo), this.add(video, saveTo);
    }
}
exports.default = Downloader;
//# sourceMappingURL=downloader.js.map