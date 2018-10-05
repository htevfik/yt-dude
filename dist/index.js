"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const error_1 = require("./error");
const parser_1 = require("./parser");
const requestPromise = require("request-promise");
const cheerio = require("cheerio");
class Crawler {
    constructor() {
        this.headers = {
            accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
            'accept-encoding': "gzip",
            'accept-language': "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7,ru;q=0.6",
            'cache-control': "max-age=0",
            cookie: "VISITOR_INFO1_LIVE=pFbQsaRav8E; PREF=f1=50000000; YSC=sqhan-_xa-I; GPS=1",
            dnt: "1",
            'upgrade-insecure-requests': "1",
            'user-agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36",
        };
        this.verbose = false;
    }
    request(url) {
        const { headers } = this;
        if (this.verbose) {
            console.log('GET: ' + url);
        }
        return requestPromise({ url, headers, gzip: true });
    }
    searchResultRequest(url) {
        return this.request(url).then(body => {
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
}
Crawler.properyPath = 'ytInitialData.contents.twoColumnSearchResultsRenderer.primaryContents.' +
    'sectionListRenderer.contents.0.itemSectionRenderer.contents';
module.exports = new Crawler();
//# sourceMappingURL=index.js.map