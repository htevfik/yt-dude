"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
class DudeEvent extends events_1.EventEmitter {
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
exports.DudeEvent = DudeEvent;
//# sourceMappingURL=event.js.map