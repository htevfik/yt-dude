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
  then(callback: () => void, errorCallback?: (err: Error) => void): Promise<void> {
    return new Promise((...args) => {
      this.on('done', args[0]);

      if (errorCallback) {
        this.on('error', args[1]);
      }
    }).then(callback, errorCallback);
  }

  catch(errorCallback: (err: Error) => void) {
    return new Promise((...args) => {
      this.on('error', args[1]);
    }).catch(errorCallback);
  }
}

export { DudeEvent };