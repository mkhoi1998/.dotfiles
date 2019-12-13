"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const facade_1 = require("../backend/facade");
class SymbolCodeLens extends vscode_1.CodeLens {
    constructor(symbol, range) {
        super(range);
        this.symbol = symbol;
    }
}
;
class AntlrCodeLensProvider {
    constructor(backend) {
        this.backend = backend;
        this._onDidChangeCodeLenses = new vscode_1.EventEmitter();
        this.onDidChangeCodeLenses = this._onDidChangeCodeLenses.event;
    }
    refresh() {
        this._onDidChangeCodeLenses.fire();
    }
    provideCodeLenses(document, token) {
        if (vscode_1.workspace.getConfiguration("antlr4.referencesCodeLens")["enabled"] !== true) {
            return [];
        }
        this.documentName = document.fileName;
        let symbols = this.backend.listTopLevelSymbols(document.fileName, false);
        var lenses = [];
        for (let symbol of symbols) {
            if (!symbol.definition) {
                continue;
            }
            switch (symbol.kind) {
                case facade_1.SymbolKind.FragmentLexerToken:
                case facade_1.SymbolKind.LexerToken:
                case facade_1.SymbolKind.LexerMode:
                case facade_1.SymbolKind.ParserRule: {
                    let range = new vscode_1.Range(symbol.definition.range.start.row - 1, symbol.definition.range.start.column, symbol.definition.range.end.row - 1, symbol.definition.range.end.column);
                    let lens = new SymbolCodeLens(symbol, range);
                    lenses.push(lens);
                }
                default:
                    break;
            }
        }
        return lenses;
    }
    resolveCodeLens(codeLens, token) {
        let refs = this.backend.countReferences(this.documentName, codeLens.symbol.name);
        codeLens.command = {
            title: (refs === 1) ? "1 reference" : refs + " references",
            command: "",
            arguments: undefined
        };
        return codeLens;
    }
}
exports.AntlrCodeLensProvider = AntlrCodeLensProvider;
;
//# sourceMappingURL=CodeLensProvider.js.map