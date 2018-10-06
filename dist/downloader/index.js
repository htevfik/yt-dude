"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parser_1 = require("../crawler/parser");
const event_1 = require("./event");
const ffmpeg = require("easy-ffmpeg");
const ytdl = require("ytdl-core");
class Downloader {
    constructor() {
        this.limit = 5;
        this.queue = [];
        this.verbose = false;
    }
    static progress(...args) {
        let video, currentTime, event;
        if (args.length === 2) {
            [video, event] = args;
            currentTime = video.length;
        }
        else if (args.length === 3) {
            [video, currentTime, event] = args;
        }
        return event.emit('progress', {
            percent: Number((currentTime / video.length * 100).toFixed(2)),
            totalTime: video.length,
            currentTime
        });
    }
    get ongoing() {
        return this.queue.filter(item => item.ongoing).length;
    }
    addQueue(video, saveTo) {
        const dudeEvent = new event_1.DudeEvent();
        this.queue.push({ video, saveTo, dudeEvent });
        this.checkQueue();
        return dudeEvent;
    }
    removeQueue(item) {
        this.queue.splice(this.queue.indexOf(item), 1);
        this.checkQueue();
    }
    checkQueue() {
        const limit = this.limit - this.ongoing;
        if (limit > 0) {
            this.queue
                .filter(item => !item.ongoing)
                .slice(0, limit)
                .map(item => this.run(item));
        }
    }
    run(item) {
        const { video, saveTo, dudeEvent } = item, { videoId } = video, url = 'https://www.youtube.com/watch?v=' + videoId, ytstream = ytdl(url, { quality: 'highest', filter: 'audio' }), ffstream = ffmpeg().input(ytstream).format('mp3').save(saveTo);
        item.ongoing = true;
        if (this.verbose) {
            console.log('Downloading: ' + video.title);
        }
        ffstream.on('error', err => {
            this.removeQueue(item);
            dudeEvent.emit('error', err);
        });
        ffstream.on('end', () => {
            this.removeQueue(item);
            Downloader.progress(video, dudeEvent);
            dudeEvent.emit('done');
            if (this.verbose) {
                console.log('Done: ' + video.title);
            }
        });
        ffstream.on('progress', function (progress) {
            Downloader.progress(video, parser_1.Parser.videoLength({ simpleText: progress.timemark }), dudeEvent);
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
        return this.checkArguments(video, saveTo), this.addQueue(video, saveTo);
    }
}
exports.downloader = new Downloader();
//# sourceMappingURL=index.js.map