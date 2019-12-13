"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const vscode_1 = require("vscode");
const AntlrTreeDataProvider_1 = require("./AntlrTreeDataProvider");
class ParserSymbolsProvider extends AntlrTreeDataProvider_1.AntlrTreeDataProvider {
    getChildren(element) {
        if (!element) {
            let rules;
            if (this.currentFile) {
                rules = this.backend.getRuleList(this.currentFile);
            }
            if (rules) {
                let list = [];
                for (let i = 0; i < rules.length; ++i) {
                    let caption = i + ": " + rules[i];
                    let info = this.backend.infoForSymbol(this.currentFile, rules[i]);
                    let parameters = { title: "", command: "" };
                    if (info && info.definition) {
                        parameters.title = "";
                        parameters.command = "antlr.selectGrammarRange";
                        parameters.arguments = [info.definition.range];
                    }
                    list.push(new ParserSymbol(caption, vscode_1.TreeItemCollapsibleState.None, parameters));
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
exports.ParserSymbolsProvider = ParserSymbolsProvider;
class ParserSymbol extends vscode_1.TreeItem {
    constructor(label, collapsibleState, command_) {
        super(label, collapsibleState);
        this.label = label;
        this.collapsibleState = collapsibleState;
        this.iconPath = {
            light: path.join(__dirname, '..', '..', '..', 'misc', 'rule-light.svg'),
            dark: path.join(__dirname, '..', '..', '..', 'misc', 'rule-dark.svg')
        };
        this.contextValue = 'parserSymbols';
        this.command = command_;
    }
}
exports.ParserSymbol = ParserSymbol;
//# sourceMappingURL=ParserSymbolsProvider.js.map