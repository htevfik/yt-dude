import { QueueItem } from "./queue";

export default class Downloader {
  public limit = 5;
  public queue = [] as QueueItem[];
  public verbose = false;

  private add(video: Youtube.Video, saveTo: string) {
    const item = new QueueItem(video, saveTo);

    item.on('done', () => {
      this.remove(item);
    });

    this.queue.push(item);
    this.check();

    return item;
  }

  private remove(item: QueueItem) {
    this.queue.splice(this.queue.indexOf(item), 1);
    this.check();
  }

  private check() {
    let
      waiting = this.queue.filter(item => !item.active),
      times = this.limit - (this.queue.length - waiting.length);

    waiting.slice(0, times).map(item => {
      item.download();
    });
  }

  private checkArguments(video, saveTo) {
    if (!video) {
      throw new Error('Video not set!');
    } else if (!saveTo) {
      throw new Error('Output file path not set!')
    } else if (!video.videoId) {
      throw new TypeError('video must be a DudeVideo');
    } else if (typeof saveTo != 'string') {
      throw new TypeError('saveTo must be a string');
    }
  }

  download(video: Youtube.Video, saveTo: string) {
    return this.checkArguments(video, saveTo), this.add(video, saveTo);
  }
}