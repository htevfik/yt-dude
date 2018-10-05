import { CrawlerError } from './error';
import { Parser } from './parser';
import requestPromise = require('request-promise');
import cheerio = require('cheerio');

class Crawler {
  private static readonly properyPath =
    'ytInitialData.contents.twoColumnSearchResultsRenderer.primaryContents.' +
    'sectionListRenderer.contents.0.itemSectionRenderer.contents';

  public headers = {
    accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
    'accept-encoding': "gzip",
    'accept-language': "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7,ru;q=0.6",
    'cache-control': "max-age=0",
    cookie: "VISITOR_INFO1_LIVE=pFbQsaRav8E; PREF=f1=50000000; YSC=sqhan-_xa-I; GPS=1",
    dnt: "1",
    'upgrade-insecure-requests': "1",
    'user-agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36",
  };

  public verbose = false;

  private request(url: string) {
    const { headers } = this;

    if (this.verbose) {
      console.log('GET: ' + url);
    }

    return requestPromise({ url, headers, gzip: true });
  }

  private searchResultRequest(url: string) {
    return this.request(url).then(body => {
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

export const crawler = new Crawler();