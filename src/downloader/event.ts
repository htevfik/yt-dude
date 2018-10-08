import { EventEmitter } from "events";

interface DudeEvent extends EventEmitter {
  on(event: 'done', listener: () => void);
  emit(event: 'done');
  on(event: 'error', listener: (error: Error) => void);
  emit(event: 'error', error: Error);
  on(event: 'progress', listener: (progress: Dude.ProgressEvent) => void);
  emit(event: 'progress', progress: Dude.ProgressEvent);
}

class DudeEvent extends EventEmitter {
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

export { DudeEvent };