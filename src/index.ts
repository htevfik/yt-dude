import { crawler } from './crawler';
import { downloader } from './downloader';
import { extractor } from './extractor';

export class YoutubeDude {
  private url: string = 'https://www.youtube.com';
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

  public download(video: Dude.Video | Dude.Result, saveTo: string) {
    return downloader.download(video, saveTo);
  }

  public crawl(url: string) {
    return extractor.get(url);
  }

  public search(terms: string) {
    return this.crawl(this.url + '/results?search_query=' + encodeURIComponent(terms));
  }

  public feed() {
    return this.crawl(this.url);
  }

  public gaming() {
    return this.crawl(this.url + '/gaming');
  }

  public trending() {
    return this.crawl(this.url + '/feed/trending');
  }

  // channel videos
  public channel(id: string) {
    return this.crawl(this.url + '/channel/' + id);
  }

  // shortcuts
  private channels = {
    music: 'UC-9-kyTW8ZkZNDHQJ6FgpwQ',
    sport: 'UCEgdi0XIXXZ-qJOFPf4JSKw',
    news: 'UCYfdidRxbB8Qhf0Nx7ioOYw',
    live: 'UC4R8DWoMoI7CAwX8_LjQHig',
    vr: 'UCzuqhhs6NWbgTzMuM09WKDQ'
  };

  public music() {
    return this.channel(this.channels.music);
  }

  public sport() {
    return this.channel(this.channels.sport);
  }

  public news() {
    return this.channel(this.channels.news);
  }

  public live() {
    return this.channel(this.channels.live);
  }

  public vr() {
    return this.channel(this.channels.vr);
  }
}

module.exports = new YoutubeDude();