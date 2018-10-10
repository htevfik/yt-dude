"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./prototype/all");
const extractor_1 = require("./extractor");
process.on('message', event => {
    if (event) {
        Object.defineProperty(extractor_1.default, 'FORKED', { value: true });
        extractor_1.default.get(event.url).then(data => {
            process.send({ data });
        }, error => {
            process.send({ error });
        });
    }
});
//# sourceMappingURL=extractor-fork.js.map