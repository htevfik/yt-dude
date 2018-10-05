"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CrawlerError extends Error {
    constructor() {
        super(...arguments);
        this.name = 'CrawlerError';
    }
}
exports.CrawlerError = CrawlerError;
//# sourceMappingURL=error.js.map