"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs-extra");
const crypto = require("crypto");
const path = require("path");
const vscode_1 = require("vscode");
class Utils {
    static getMiscPath(file, context, webView) {
        if (webView) {
            let uri = vscode_1.Uri.file(context.asAbsolutePath(path.join('misc', file)));
            return webView.asWebviewUri(uri).toString();
        }
        return context.asAbsolutePath(path.join('misc', file));
    }
    static getNodeModulesPath(file, context) {
        return vscode_1.Uri.file(context.asAbsolutePath(path.join('node_modules', file))).with({ scheme: 'vscode-resource' }).toString();
    }
    static isAbsolute(p) {
        return path.normalize(p + '/') === path.normalize(path.resolve(p) + '/');
    }
    static deleteFolderRecursive(path) {
        var files = [];
        if (fs.existsSync(path)) {
            files = fs.readdirSync(path);
            files.forEach(function (file, index) {
                var curPath = path + "/" + file;
                if (fs.lstatSync(curPath).isDirectory()) {
                    Utils.deleteFolderRecursive(curPath);
                }
                else {
                    fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(path);
        }
    }
    ;
    static hashForPath(dataPath) {
        return crypto.createHash('md5').update(dataPath).digest('hex');
    }
    static copyFilesIfNewer(files, targetPath) {
        try {
            fs.ensureDirSync(targetPath);
        }
        catch (error) {
            vscode_1.window.showErrorMessage("Could not create target folder '" + targetPath + "'. " + error);
        }
        for (let file of files) {
            try {
                let canCopy = true;
                let targetFile = path.join(targetPath, path.basename(file));
                if (fs.existsSync(targetFile)) {
                    let sourceStat = fs.statSync(file);
                    let targetStat = fs.statSync(targetFile);
                    canCopy = targetStat.mtime < sourceStat.mtime;
                }
                if (canCopy) {
                    fs.copy(file, targetFile, { overwrite: true });
                }
            }
            catch (error) {
                vscode_1.window.showErrorMessage("Could not copy file '" + file + "'. " + error);
            }
        }
    }
    static exportDataWithConfirmation(fileName, filters, data, extraFiles) {
        vscode_1.window.showSaveDialog({
            defaultUri: vscode_1.Uri.file(fileName),
            filters: filters
        }).then((uri) => {
            if (uri) {
                let value = uri.fsPath;
                fs.writeFile(value, data, (error) => {
                    if (error) {
                        vscode_1.window.showErrorMessage("Could not write to file: " + value + ": " + error.message);
                    }
                    else {
                        this.copyFilesIfNewer(extraFiles, path.dirname(value));
                        vscode_1.window.showInformationMessage("Diagram successfully written to file '" + value + "'.");
                    }
                });
            }
        });
    }
    static findInListFromPosition(list, column, row) {
        for (let entry of list) {
            if (!entry.range) {
                continue;
            }
            let start = entry.range.start;
            let stop = entry.range.end;
            let matched = start.row <= row && stop.row >= row;
            if (matched) {
                if (start.row == row) {
                    matched = start.column <= column;
                }
                else if (stop.row == row) {
                    matched = stop.column >= column;
                }
            }
            if (matched) {
                return entry;
            }
        }
    }
}
exports.Utils = Utils;
;
//# sourceMappingURL=Utils.js.map