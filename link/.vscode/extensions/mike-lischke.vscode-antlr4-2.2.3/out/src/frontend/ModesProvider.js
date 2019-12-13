"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const vscode_1 = require("vscode");
const AntlrTreeDataProvider_1 = require("./AntlrTreeDataProvider");
class ModesProvider extends AntlrTreeDataProvider_1.AntlrTreeDataProvider {
    getTreeItem(element) {
        return element;
    }
    getChildren(element) {
        if (!element) {
            var modes;
            if (this.currentFile) {
                modes = this.backend.getModes(this.currentFile);
            }
            if (modes) {
                let list = [];
                for (let mode of modes) {
                    list.push(new ModeEntry(mode, vscode_1.TreeItemCollapsibleState.None, {
                        title: "<unused>",
                        command: "",
                        arguments: []
                    }));
                }
                return new Promise(resolve => {
                    resolve(list);
                });
            }
        }
        return new Promise(resolve => {
            resolve([]);
        });
    }
}
exports.ModesProvider = ModesProvider;
class ModeEntry extends vscode_1.TreeItem {
    constructor(label, collapsibleState, command_) {
        super(label, collapsibleState);
        this.label = label;
        this.collapsibleState = collapsibleState;
        this.iconPath = {
            light: path.join(__dirname, '..', '..', '..', 'misc', 'mode-light.svg'),
            dark: path.join(__dirname, '..', '..', '..', 'misc', 'mode-dark.svg')
        };
        this.contextValue = 'lexerSymbols';
        this.command = command_;
    }
}
exports.ModeEntry = ModeEntry;
//# sourceMappingURL=ModesProvider.js.map