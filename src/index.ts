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

  public music() {
    return this.crawl('https://www.youtube.com/channel/UC-9-kyTW8ZkZNDHQJ6FgpwQ');
  }

  public sport() {
    return this.crawl('https://www.youtube.com/channel/UCEgdi0XIXXZ-qJOFPf4JSKw');
  }

  public news() {
    return this.crawl('https://www.youtube.com/channel/UCYfdidRxbB8Qhf0Nx7ioOYw');
  }

  public live() {
    return this.crawl('https://www.youtube.com/channel/UC4R8DWoMoI7CAwX8_LjQHig');
  }

  public vr() {
    return this.crawl('https://www.youtube.com/channel/UCzuqhhs6NWbgTzMuM09WKDQ');
  }

  public gaming() {
    return this.crawl('https://www.youtube.com/gaming');
  }

  public feed() {
    return this.crawl('https://www.youtube.com/');
  }

  public trending() {
    return this.crawl('https://www.youtube.com/feed/trending');
  }
}

module.exports = new YoutubeDude();