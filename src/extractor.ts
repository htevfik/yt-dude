import Request from "./request";
import FileSystem from "./filesystem";
import cheerio = require('cheerio');
import { fork } from 'child_process';
import { resolve, dirname } from 'path';

export default class Extractor {
  private static readonly FORKED = false;
  public static get(url: string) {
    if (!this.FORKED) {
      const forked = fork(resolve(dirname(__filename), 'extractor-fork.js'));
      return new Promise((resolve, reject) => {
        forked.send({ url });
        forked.on('message', (event: { data: any, error: Error }) => {
          if (event.error) {
            reject(event.error);
          } else {
            resolve(event.data);
          }
          forked.kill();
        });
      });
    }

    return this.cache(url).then(result => {
      return result || Request.get(url).then(body => {
        const
          data = this.run(body),
          json = JSON.stringify(data);

        return this.cache(url, json).then(() => data);
      });
    });
  }

  private static cache(url: string, body?: string) {
    const { path, json } = Request.createCachePath(url);

    if (body === void 0) {
      return FileSystem.stat(json).then(stats => {
        // if cache file older than 30 minutes 
        return Date.now() - stats.mtime.getTime() > 18e5 ? null : FileSystem.read(json);
      }, err => {
        return err.code === 'ENOENT' ? null : err;
      }).then(json => {
        if (json) {
          try {
            return JSON.parse(json);
          } catch (err) { }
        }

        return null;
      });
    }

    return FileSystem.makePath(path, true).then(() => {
      return FileSystem.write(json, body);
    }).then(() => {
      return body;
    });
  }

  private static run(body: string) {
    const chunk = this.extract(body), items = {};

    for (let stack of chunk) {
      stack = this.walk(stack);
      if (stack) {
        for (let item of stack) {
          let id = item.videoId || item.playlistId;
          items[id] = this.merge(this.scalarData(item), items[id] || {});
        }
      }
    }

    return Object.values(items);
  }

  private static merge(from, to) {
    for (let i in from) {
      if (typeof from[i] == 'object') {
        if (to[i]) {
          if (from[i] instanceof Array) {
            to[i] = to[i].concat(...from[i]);
          } else {
            this.merge(from[i], to[i]);
          }
        } else {
          to[i] = from[i];
        }
      } else if (from[i] !== void 0) {
        to[i] = from[i];
      }
    }

    return to;
  }

  private static runs(pack: { runs: { text: string } }) {
    let o = "";

    if (pack && (pack.runs instanceof Array)) {
      for (let run of pack.runs) {
        o += run.text || "";
      }
    }

    return o.replace(/\s+/g, " ");
  }

  private static label(text: Youtube.Text): string {
    if (!text) return null;
    return Object.child(text.accessibility || text, 'accessibilityData.label');
  }

  private static text(text: Youtube.Text): string {
    if (!text) return "";
    if (typeof text == 'string') return text;

    return text.simpleText || null;
  }

  private static readonly multipliers = [1, 60, 3600, 86400];
  public static videoLength(text: any): number {
    return this.text(text).split('.')[0].split(/\D+/).reverse().map((x, i) => +x * this.multipliers[i]).reduce((a, b) => a + b);
  }

  private static scalarData(item) {
    let output = {}, sorted = {};

    for (let i in item) {
      let dived = this.dive(i, item[i]);

      if (dived == null) {
        continue;
      }

      if (typeof dived === 'object') {
        output = { ...output, ...dived };
      } else {
        output[i] = dived;
      }
    }

    for (let k of Object.keys(output).sort()) {
      sorted[k] = output[k];
    }

    return sorted;
  }

  private static dive(name, value) {
    if (!value) {
      return value;
    }

    if (/string|number|boolean/.test(typeof value)) {
      return { [name]: value };
    } else if (value instanceof Array) {
      let simplified = value.map(item => {
        let keys = Object.keys(item), key = keys.first;

        if (keys.length === 1) {
          return Object.values(this.dive(key, item[key])).first;
        }
      }).filter(Boolean).unique();

      if (simplified.length > 0) {
        return { [name]: simplified }
      }
    }

    if (value.runs instanceof Array) {

      if (name == 'shortBylineText') {
        let channelUrl = value.runs.map(item => Object.child(item, 'navigationEndpoint.commandMetadata.webCommandMetadata.url')).firstValid;

        if (channelUrl) {
          return { channelId: channelUrl.split(/\/+/).lastValid, channelUrl, channelName: this.runs(value) };
        }
      }

      return { [name]: this.runs(value) };
    }

    if (value.simpleText) {
      let label = this.label(value);

      return {
        [name]: value.simpleText,
        ...label ? { [name + 'Long']: this.label(value) } : {},
        .../count/i.test(name) ? { [name.replace(/text$/i, '')]: +value.simpleText.replace(/\D+/g, '') } : {},
        ...name == 'lengthText' ? { length: this.videoLength(value) } : {}
      };
    }

    if (value.thumbnails instanceof Array) {
      let
        thumbnails = value.thumbnails.map(thumbnail => thumbnail.url),
        thumbnail = thumbnails[0] || null;

      return thumbnails.length > 1 ? { [name + 's']: thumbnails, [name]: thumbnail } : { [name]: thumbnail };
    }

    let pairs = {
      richThumbnail: 'movingThumbnailRenderer.movingThumbnailDetails',
      thumbnailRenderer: 'playlistVideoThumbnailRenderer.thumbnail',
    };

    if (pairs[name]) {
      return this.dive(name, Object.child(value, pairs[name]));
    }

    switch (name) {
      case 'ownerBadges':
        value = value.find(badge => Object.child(badge, 'metadataBadgeRenderer.style'));
        return { channelVerified: /_VERIFIED$/.test(value) };

      case 'thumbnailOverlays':
        let overlay = value.map(overlay => Object.child(overlay, 'thumbnailOverlayTimeStatusRenderer.text')).firstValid;
        let { durationText, durationTextLong } = this.dive('durationText', overlay) || {} as any;

        if (durationText) {
          return { duration: this.videoLength(durationText), durationText, durationTextLong };
        }
    }
  }

  private static readonly videoKeys = ['videoId', 'thumbnail', 'title'];
  private static readonly playlistKeys = ['playlistId', 'thumbnail', 'title'];
  private static walk(chunk) {
    const output = [];

    Object.walk(chunk, val => {
      if (val && typeof val == 'object') {
        if (
          Object.hasKeys(val, ...this.videoKeys) ||
          Object.hasKeys(val, ...this.playlistKeys)
        ) {
          output.push(val);
        }
      }
    });

    return output;
  }

  private static extract(body) {
    const $ = cheerio.load(body), output = [];

    for (let script of Array.from($('script'))) {
      let html = $(script).html();

      if (html.includes('window["ytInitialData"] = ') || html.includes('ytInitialGuideData = ')) {
        html = html.splitAfter('window["ytInitialData"] = ', 'ytInitialGuideData = ');
        html = html.splitUntil('};');
        html = html.concat("}");

        try {
          output.push(JSON.parse(html));
        } catch (err) {
          console.log(err.name, html.substring(0, 50), '...', html.substring(html.length - 50))
        }
      }
    }

    return output;
  }
}