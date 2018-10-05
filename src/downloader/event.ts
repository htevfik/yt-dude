import { EventEmitter } from "events";

interface DudeEvent extends EventEmitter {
  on(event: 'done', listener: () => void);
  emit(event: 'done');
  on(event: 'error', listener: (error: Error) => void);
  emit(event: 'error', error: Error);
  on(event: 'progress', listener: (progress: Dude.ProgressEvent) => void);
  emit(event: 'progress', progress: Dude.ProgressEvent);
}

class DudeEvent extends EventEmitter { }

export { DudeEvent };