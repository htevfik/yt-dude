import fs = require('fs');
import Path = require('path');

export default class FileSystem {
  public static stat(path: string): Promise<fs.Stats> {
    return new Promise((resolve, reject) => {
      fs.stat(path, (err, stat) => {
        if (err) reject(err);
        else resolve(stat);
      });
    });
  }

  public static exists(path: string): Promise<boolean> {
    return this.stat(path).then(stat => {
      return true;
    }, err => {
      return err.code == 'ENOENT' ? false : err;
    });
  }

  public static isDir(path: string): Promise<boolean> {
    return this.stat(path).then(stat => {
      return stat.isDirectory();
    }, err => {
      return err.code == 'ENOENT' ? false : err;
    });
  }

  public static makeDir(path: string, force = false): Promise<void> {
    return this.stat(path).then(stat => {
      return stat.isDirectory() || force && this.unlink(path) as any;
    }, err => {
      return err.code == 'ENOENT' ? void 0 : Promise.reject(err);
    }).then(exists => {
      return exists || new Promise((resolve, reject) => {
        fs.mkdir(path, err => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    });
  }

  public static makePath(path: string, force = false) {
    let index = arguments[2] || 1;
    const
      parts = path.split(/[\\\/]/),
      curPath = parts.slice(0, index).join(Path.sep);

    return index > parts.length ? Promise.resolve() : this.makeDir(curPath, force).then(() => {
      return this.makePath.apply(this, [path, force, index + 1]);
    });
  }

  public static parent(path: string) {
    const splitted = path.split(/[\\\/]/);
    return splitted.slice(0, splitted.length - 1);
  }

  public static unlink(path: string): Promise<void> {
    return new Promise((resolve, reject) => {
      fs.unlink(path, err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      })
    })
  }

  public static read(path: string) {
    return new Promise((resolve, reject) => {
      fs.readFile(path, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    })
  }

  public static write(path: string, data: any) {
    return new Promise((resolve, reject) => {
      fs.writeFile(path, data, err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}