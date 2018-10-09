"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const error_1 = require("./error");
const parser_1 = require("./parser");
const request_1 = require("../request");
const extractor_1 = require("../extractor");
const cheerio = require("cheerio");
class Crawler {
    constructor() {
        this.verbose = false;
    }
    searchResultRequest(url) {
        return request_1.request.get(url).then(body => {
            let $ = cheerio.load(body), window = {}, output = [];
            for (let script of Array.from($('script'))) {
                let html = $(script).html();
                if (html.indexOf('ytInitialData') > -1) {
                    try {
                        eval(html);
                    }
                    catch (err) {
                        if (this.verbose) {
                            console.error(err);
                        }
                    }
                    for (let item of parser_1.Parser.child(window, Crawler.properyPath, [])) {
                        if (item && item.videoRenderer) {
                            output.push(parser_1.Parser.extract(item.videoRenderer));
                        }
                    }
                    window = null;
                    break;
                }
            }
            if (this.verbose) {
                let { length } = output;
                console.log(length ? length + ' result' + (length > 1 ? 's' : '') + ' found' : 'No results found');
            }
            return output;
        });
    }
    search(keywords) {
        if (!keywords) {
            throw new error_1.CrawlerError("No keyword passed for search method");
        }
        else if (typeof keywords !== 'string') {
            throw new TypeError("Argument \"keywords\" must be a string");
        }
        keywords = encodeURIComponent(keywords);
        return this.searchResultRequest('https://www.youtube.com/results?search_query=' + keywords);
    }
    crawlUrl(url) {
        return request_1.request.get(url).then(body => {
            return extractor_1.runExtractor(body);
        });
    }
}
Crawler.properyPath = 'ytInitialData.contents.twoColumnSearchResultsRenderer.primaryContents.' +
    'sectionListRenderer.contents.0.itemSectionRenderer.contents';
const crawler = new Crawler();
exports.crawler = crawler;
//# sourceMappingURL=index.js.map