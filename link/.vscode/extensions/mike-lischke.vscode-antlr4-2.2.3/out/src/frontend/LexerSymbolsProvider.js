"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const vscode_1 = require("vscode");
const AntlrTreeDataProvider_1 = require("./AntlrTreeDataProvider");
class LexerSymbolsProvider extends AntlrTreeDataProvider_1.AntlrTreeDataProvider {
    getChildren(element) {
        if (!element) {
            let vocabulary;
            if (this.currentFile) {
                vocabulary = this.backend.getLexerVocabulary(this.currentFile);
            }
            if (vocabulary) {
                let list = [];
                list.push(new LexerSymbol("-1: EOF", vscode_1.TreeItemCollapsibleState.None, {
                    title: "<unused>",
                    command: "",
                    arguments: []
                }));
                for (let i = 0; i <= vocabulary.maxTokenType; ++i) {
                    let literal = vocabulary.getLiteralName(i);
                    let symbolic = vocabulary.getSymbolicName(i);
                    let caption = i + ": ";
                    if (!literal && !symbolic) {
                        caption += "<unused>";
                    }
                    else {
                        if (symbolic) {
                            caption += symbolic;
                        }
                        else {
                            caption += "<implicit token>";
                        }
                        if (literal) {
                            caption += " (" + literal + ")";
                        }
                    }
                    let info = this.backend.infoForSymbol(this.currentFile, symbolic ? symbolic : literal.substr(1, literal.length - 2));
                    let parameters = { title: "", command: "" };
                    if (info && info.definition) {
                        parameters.title = "";
                        parameters.command = "antlr.selectGrammarRange";
                        parameters.arguments = [info.definition.range];
                    }
                    list.push(new LexerSymbol(caption, vscode_1.TreeItemCollapsibleState.None, parameters));
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
exports.LexerSymbolsProvider = LexerSymbolsProvider;
class LexerSymbol extends vscode_1.TreeItem {
    constructor(label, collapsibleState, command_) {
        super(label, collapsibleState);
        this.label = label;
        this.collapsibleState = collapsibleState;
        this.iconPath = {
            light: path.join(__dirname, '..', '..', '..', 'misc', 'token-light.svg'),
            dark: path.join(__dirname, '..', '..', '..', 'misc', 'token-dark.svg')
        };
        this.contextValue = 'lexerSymbols';
        this.command = command_;
    }
}
exports.LexerSymbol = LexerSymbol;
//# sourceMappingURL=LexerSymbolsProvider.js.map