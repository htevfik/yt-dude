"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
class DudeEvent extends events_1.EventEmitter {
    then(callback, errorCallback) {
        return new Promise((...args) => {
            this.on('done', args[0]);
            if (errorCallback) {
                this.on('error', args[1]);
            }
        }).then(callback, errorCallback);
    }
    catch(errorCallback) {
        return new Promise((...args) => {
            this.on('error', args[1]);
        }).catch(errorCallback);
    }
}
exports.DudeEvent = DudeEvent;
//# sourceMappingURL=event.js.map