"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const Path = require("path");
class FileSystem {
    static stat(path) {
        return new Promise((resolve, reject) => {
            fs.stat(path, (err, stat) => {
                if (err)
                    reject(err);
                else
                    resolve(stat);
            });
        });
    }
    static exists(path) {
        return this.stat(path).then(stat => {
            return true;
        }, err => {
            return err.code == 'ENOENT' ? false : err;
        });
    }
    static isDir(path) {
        return this.stat(path).then(stat => {
            return stat.isDirectory();
        }, err => {
            return err.code == 'ENOENT' ? false : err;
        });
    }
    static makeDir(path, force = false) {
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
    static makePath(path, force = false) {
        let index = arguments[2] || 1;
        const parts = path.split(/[\\\/]/), curPath = parts.slice(0, index).join(Path.sep);
        return index > parts.length ? Promise.resolve() : this.makeDir(curPath, force).then(() => {
            return this.makePath.apply(this, [path, force, index + 1]);
        });
    }
    static parent(path) {
        const splitted = path.split(/[\\\/]/);
        return splitted.slice(0, splitted.length - 1);
    }
    static unlink(path) {
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
    static read(path) {
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
    static write(path, data) {
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
exports.default = FileSystem;
//# sourceMappingURL=filesystem.js.map