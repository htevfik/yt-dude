import { fork } from 'child_process';
import { EventEmitter } from 'events';
import { dirname, resolve } from 'path';
import FileSystem from './filesystem';

export interface QueueItem {
  on(event: 'done', listener: () => void);
  emit(event: 'done');
  on(event: 'error', listener: (error: Error) => void);
  emit(event: 'error', error: Error);
  on(event: 'progress', listener: (progress: Youtube.DownloadProgress) => void);
  emit(event: 'progress', progress: Youtube.DownloadProgress);
}

export class QueueItem extends EventEmitter {
  public active = false;
  constructor(public video: Youtube.Video, public saveTo: string) {
    super();
  }

  private progress(percent: number) {
    this.emit('progress', { percent } as any);
  }
  
  // private progress(currentTime?: number) {
  //   const totalTime = this.video.duration || this.video.length;
  //   currentTime = currentTime === void 0 ? totalTime : currentTime;

  //   this.emit('progress', {
  //     totalTime,
  //     currentTime,
  //     percent: +(currentTime / totalTime * 100).toFixed(2),
  //   });
  // }

  download() {
    const forked = fork(resolve(dirname(__filename), 'queue-fork.js'));
    this.active = true;

    FileSystem.makePath(dirname(this.saveTo)).then(() => {
      forked.send({
        url: 'https://www.youtube.com/watch?v=' + this.video.videoId,
        saveTo: this.saveTo
      });

      this.progress(0);
    });

    forked.on('message', (event: {
      type: 'error' | 'progress' | 'end'
      value?: number | Error
    }) => {
      const { type, value } = event;

      switch (type) {
        case 'error':
          forked.kill();
          this.active = false;
          this.emit('error', value as Error);
          break;
        case 'progress':
          this.progress(value as number);
          break;
        case 'end':
          forked.kill();
          this.active = false;
          this.emit('done');
          break;
      }
    });

    return this;
  }

  toPromise(): Promise<void> {
    return new Promise((...args) => {
      this.on('done', args[0]);
      this.on('error', args[1]);
    });
  }

  then(callback: () => void, errorCallback?: (err: Error) => void): Promise<void> {
    return this.toPromise().then(callback, errorCallback);
  }

  catch(errorCallback: (err: Error) => void) {
    return this.toPromise().catch(errorCallback);
  }
}