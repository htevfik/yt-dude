import { CrawlerError } from './error';
import { Parser } from './parser';
import { request } from '../request';
import { extractor } from '../extractor';
import cheerio = require('cheerio');

class Crawler {
  private static readonly properyPath =
    'ytInitialData.contents.twoColumnSearchResultsRenderer.primaryContents.' +
    'sectionListRenderer.contents.0.itemSectionRenderer.contents';

  public verbose = false;

  private searchResultRequest(url: string) {
    return request.get(url).then(body => {
      let
        $ = cheerio.load(body),
        window = {} as any,
        output = [];

      for (let script of Array.from($('script'))) {
        let html = $(script).html();

        if (html.indexOf('ytInitialData') > -1) {
          try {
            eval(html);
          } catch (err) {
            if (this.verbose) {
              console.error(err);
            }
          }

          for (let item of Parser.child<Youtube.Stack>(window, Crawler.properyPath, [])) {
            if (item && item.videoRenderer) {
              output.push(Parser.extract(item.videoRenderer));
            }
          }

          window = null;
          break;
        }
      }

      if (this.verbose) {
        let { length } = output;
        console.log(length ? length + ' result' + (length > 1 ? 's' : '') + ' found' : 'No results found')
      }

      return output;
    });
  }

  public search(keywords: string) {
    if (!keywords) {
      throw new CrawlerError("No keyword passed for search method");
    } else if (typeof keywords !== 'string') {
      throw new TypeError("Argument \"keywords\" must be a string");
    }

    keywords = encodeURIComponent(keywords);

    return this.searchResultRequest('https://www.youtube.com/results?search_query=' + keywords);
  }
}

const crawler = new Crawler();
export { crawler };