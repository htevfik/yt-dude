import { Parser } from '../crawler/parser';
import { DudeEvent } from './event';
import ffmpeg = require('easy-ffmpeg');
import ytdl = require('ytdl-core');

interface Downloader {
  progress(video: Dude.Video | Dude.Result, event: DudeEvent),
  progress(video: Dude.Video | Dude.Result, time: number, event: DudeEvent),
}

class Downloader {
  public limit = 5;
  public queue = [] as QueueItem[];
  public verbose = false;

  private static progress(...args) {
    let video: Dude.Video, currentTime: number, event: DudeEvent;

    if (args.length === 2) {
      [video, event] = args;
      currentTime = video.length;
    } else if (args.length === 3) {
      [video, currentTime, event] = args;
    }

    return event.emit('progress', {
      percent: Number((currentTime / video.length * 100).toFixed(2)),
      totalTime: video.length,
      currentTime
    });
  }

  private get ongoing() {
    return this.queue.filter(item => item.ongoing).length;
  }

  private addQueue(video: Dude.Video | Dude.Result, saveTo: string) {
    this.queue.push({ video, saveTo, dudeEvent: new DudeEvent() });
    this.checkQueue();
  }

  private removeQueue(item: QueueItem) {
    this.queue.splice(this.queue.indexOf(item), 1);
    this.checkQueue();
  }

  private checkQueue() {
    const limit = this.limit - this.ongoing;

    if (limit > 0) {
      this.queue
        .filter(item => !item.ongoing)
        .slice(0, limit)
        .map(item => this.run(item));
    }
  }

  private run(item: QueueItem) {
    const
      { video, saveTo, dudeEvent } = item,
      { videoId } = video,
      url = 'https://www.youtube.com/watch?v=' + videoId,
      ytstream = ytdl(url, { quality: 'highest', filter: 'audio' }),
      ffstream = ffmpeg().input(ytstream).format('mp3').save(saveTo);

    item.ongoing = true;

    if (this.verbose) {
      console.log('Downloading: ' + video.title);
    }


    ffstream.on('error', err => {
      this.removeQueue(item);
      dudeEvent.emit('error', err);
    });

    ffstream.on('end', () => {
      this.removeQueue(item);
      Downloader.progress(video, dudeEvent);
      dudeEvent.emit('done');

      if (this.verbose) {
        console.log('Done: ' + video.title);
      }
    });

    ffstream.on('progress', function (progress: { timemark: string }) {
      Downloader.progress(video, Parser.videoLength({ simpleText: progress.timemark }), dudeEvent);
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

  download(video: Dude.Video | Dude.Result, saveTo: string) {
    return this.checkArguments(video, saveTo), this.addQueue(video, saveTo);
  }
}

interface QueueItem {
  video: Dude.Video,
  saveTo: string,
  dudeEvent: DudeEvent,
  ongoing?: boolean
}

export const downloader = new Downloader();