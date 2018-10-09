import { request, Request } from "../request";
import { filesystem } from "../request/filesystem";
import { runExtractor } from "./extractor";

class Extractor {
  private cache(url: string, body?: string) {
    const { path, json } = Request.createCachePath(url);

    if (body === void 0) {
      return filesystem.stat(json).then(stats => {
        // if cache file older than 30 minutes 
        return Date.now() - stats.mtime.getTime() > 18e5 ? null : filesystem.read(json);
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

    return filesystem.makePath(path, true).then(() => {
      return filesystem.write(json, body);
    }).then(() => {
      return body;
    });
  }

  get(url: string) {
    return this.cache(url).then(result => {
      return result || request.get(url).then(body => {
        const
          data = runExtractor(body),
          json = JSON.stringify(data);

        return this.cache(url, json).then(() => data);
      });
    });
  }
}

export const extractor = new Extractor();