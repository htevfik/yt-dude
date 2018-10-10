"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const events_1 = require("events");
const path_1 = require("path");
const filesystem_1 = require("./filesystem");
class QueueItem extends events_1.EventEmitter {
    constructor(video, saveTo) {
        super();
        this.video = video;
        this.saveTo = saveTo;
        this.active = false;
    }
    progress(percent) {
        this.emit('progress', { percent });
    }
    // private progress(currentTime?: number) {
    //   const totalTime = this.video.duration || this.video.length;
    //   currentTime = currentTime === void 0 ? totalTime : currentTime;
    //   this.emit('progress', {
    //     totalTime,
    //     currentTime,
    //     percent: +(currentTime / totalTime * 100).toFixed(2),
    //   });
    // }
    download() {
        const forked = child_process_1.fork(path_1.resolve(path_1.dirname(__filename), 'queue-fork.js'));
        this.active = true;
        filesystem_1.default.makePath(path_1.dirname(this.saveTo)).then(() => {
            forked.send({
                url: 'https://www.youtube.com/watch?v=' + this.video.videoId,
                saveTo: this.saveTo
            });
            this.progress(0);
        });
        forked.on('message', (event) => {
            const { type, value } = event;
            switch (type) {
                case 'error':
                    forked.kill();
                    this.active = false;
                    this.emit('error', value);
                    break;
                case 'progress':
                    this.progress(value);
                    break;
                case 'end':
                    forked.kill();
                    this.active = false;
                    this.emit('done');
                    break;
            }
        });
        return this;
    }
    toPromise() {
        return new Promise((...args) => {
            this.on('done', args[0]);
            this.on('error', args[1]);
        });
    }
    then(callback, errorCallback) {
        return this.toPromise().then(callback, errorCallback);
    }
    catch(errorCallback) {
        return this.toPromise().catch(errorCallback);
    }
}
exports.QueueItem = QueueItem;
//# sourceMappingURL=queue.js.map