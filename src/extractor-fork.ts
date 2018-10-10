import './prototype/all';
import Extractor from './extractor';

process.on('message', event => {
  if (event) {
    Object.defineProperty(Extractor, 'FORKED', { value: true });
    Extractor.get(event.url).then(data => {
      process.send({ data });
    }, error => {
      process.send({ error });
    });
  }
});