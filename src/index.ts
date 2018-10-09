import { crawler } from './crawler';
import { downloader } from './downloader';

export class YoutubeDude {
  set verbose(val: boolean) {
    crawler.verbose = val;
    downloader.verbose = val;
  }

  get queueLimit() {
    return downloader.limit;
  }

  set queueLimit(val: number) {
    downloader.limit = val;
  }


  public search(keywords: string) {
    return crawler.search(keywords);
  }

  public download(video: Dude.Video | Dude.Result, saveTo: string) {
    return downloader.download(video, saveTo);
  }

  public crawl(url: string) {
    return crawler.crawlUrl(url);
  }
}

module.exports = new YoutubeDude();