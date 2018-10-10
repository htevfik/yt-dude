import Extractor from './extractor';
import * as ffmpeg from 'easy-ffmpeg';
import * as ytdl from 'ytdl-core';

process.on('message', args => {
  const { url, saveTo } = args;

  ffmpeg().input(
    ytdl(url, { quality: 'highest', filter: 'audio' }).on('progress', (cl, length, total) => {
      process.send({ type: 'progress', value: (length / total * 100).toFixed(2) })
    })
  ).format('mp3').save(saveTo).on('error', value => {
    process.send({ type: 'error', value });
  }).on('end', () => {
    process.send({ type: 'end' });
  });
});