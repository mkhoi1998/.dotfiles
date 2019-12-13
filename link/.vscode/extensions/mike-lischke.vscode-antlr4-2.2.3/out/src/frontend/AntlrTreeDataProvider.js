"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
class AntlrTreeDataProvider {
    constructor(backend) {
        this.backend = backend;
        this._onDidChangeTreeData = new vscode_1.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
    }
    refresh(document) {
        if (document.languageId === "antlr" && document.uri.scheme === "file") {
            this.currentFile = document.fileName;
        }
        else {
            this.currentFile = undefined;
        }
        this._onDidChangeTreeData.fire();
    }
    getTreeItem(element) {
        return element;
    }
    getChildren(element) {
        return new Promise(resolve => {
            resolve([]);
        });
    }
}
exports.AntlrTreeDataProvider = AntlrTreeDataProvider;
//# sourceMappingURL=AntlrTreeDataProvider.js.map