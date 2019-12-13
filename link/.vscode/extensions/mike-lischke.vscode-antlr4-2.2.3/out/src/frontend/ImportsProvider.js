"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const vscode_1 = require("vscode");
const AntlrTreeDataProvider_1 = require("./AntlrTreeDataProvider");
class ImportsProvider extends AntlrTreeDataProvider_1.AntlrTreeDataProvider {
    getChildren(element) {
        if (!element) {
            let dependencies;
            if (this.currentFile) {
                dependencies = this.backend.getDependencies(this.currentFile);
            }
            if (dependencies) {
                let imports = [];
                for (let dep of dependencies) {
                    imports.push(new Import(path.basename(dep), vscode_1.TreeItemCollapsibleState.None, {
                        title: "<unused>",
                        command: "antlr.openGrammar",
                        arguments: [dep]
                    }));
                }
                return new Promise(resolve => {
                    resolve(imports);
                });
            }
        }
        return new Promise(resolve => {
            resolve([]);
        });
    }
}
exports.ImportsProvider = ImportsProvider;
class Import extends vscode_1.TreeItem {
    constructor(label, collapsibleState, command_) {
        super(label, collapsibleState);
        this.label = label;
        this.collapsibleState = collapsibleState;
        this.iconPath = {
            light: path.join(__dirname, '..', '..', '..', 'misc', 'dependency-light.svg'),
            dark: path.join(__dirname, '..', '..', '..', 'misc', 'dependency-dark.svg')
        };
        this.contextValue = 'grammar-dependency';
        this.command = command_;
    }
}
exports.Import = Import;
//# sourceMappingURL=ImportsProvider.js.map