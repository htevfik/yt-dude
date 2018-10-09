"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const Path = require("path");
class FileSystem {
    stat(path) {
        return new Promise((resolve, reject) => {
            fs.stat(path, (err, stat) => {
                if (err)
                    reject(err);
                else
                    resolve(stat);
            });
        });
    }
    exists(path) {
        return this.stat(path).then(stat => {
            return true;
        }, err => {
            return err.code == 'ENOENT' ? false : err;
        });
    }
    isDir(path) {
        return this.stat(path).then(stat => {
            return stat.isDirectory();
        }, err => {
            return err.code == 'ENOENT' ? false : err;
        });
    }
    makeDir(path, force = false) {
        return this.stat(path).then(stat => {
            return stat.isDirectory() || force && this.unlink(path);
        }, err => {
            return err.code == 'ENOENT' ? void 0 : Promise.reject(err);
        }).then(exists => {
            return exists || new Promise((resolve, reject) => {
                fs.mkdir(path, err => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve();
                    }
                });
            });
        });
    }
    makePath(path, force = false) {
        let index = arguments[2] || 1;
        const parts = path.split(/[\\\/]/), curPath = parts.slice(0, index).join(Path.sep);
        return index > parts.length ? Promise.resolve() : this.makeDir(curPath, force).then(() => {
            return this.makePath.apply(this, [path, force, index + 1]);
        });
    }
    parent(path) {
        const splitted = path.split(/[\\\/]/);
        return splitted.slice(0, splitted.length - 1);
    }
    unlink(path) {
        return new Promise((resolve, reject) => {
            fs.unlink(path, err => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    }
    read(path) {
        return new Promise((resolve, reject) => {
            fs.readFile(path, (err, data) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(data);
                }
            });
        });
    }
    write(path, data) {
        return new Promise((resolve, reject) => {
            fs.writeFile(path, data, err => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    }
}
exports.filesystem = new FileSystem();
//# sourceMappingURL=filesystem.js.map